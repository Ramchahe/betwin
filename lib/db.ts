import mysql from "mysql2/promise"
import fs from "fs"
import path from "path"

// Track if the database has already been initialized
let isInitialized = false;

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function executeQuery<T>({ query, values = [] }: { query: string; values?: any[] }): Promise<T> {
  try {
    const [results] = await pool.execute(query, values)
    return results as T
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Database query failed")
  }
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    // Simple query to check connection
    const [result] = await pool.query('SELECT 1 as connection_test');
    console.log('✅ Database connection successful!');
    return { connected: true, message: 'Database connected successfully' };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { 
      connected: false, 
      message: 'Database connection failed', 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Initialize database schema
export async function initializeDatabase() {
  // Prevent multiple initializations
  if (isInitialized) {
    return true;
  }

  try {
    // Check connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.connected) {
      console.error("Cannot initialize database - connection failed");
      return false;
    }

    console.log("Reading schema.sql file...");
    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon to execute each statement separately
    const statements = schemaSQL
      .replace(/--.*$/gm, '') // Remove SQL comments
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (const statement of statements) {
      try {
        await pool.execute(statement);
      } catch (error) {
        // Ignore duplicate key errors as tables might already exist
        const err = error as any;
        if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_TABLE_EXISTS_ERROR') {
          // This is expected if schema was already created, just log it
          console.log(`Notice: ${err.code} - ${err.sqlMessage} (This is normal if tables already exist)`);
        } else {
          console.error(`Error executing SQL: ${statement.substring(0, 100)}...`);
          console.error(error);
        }
        // Continue with other statements even if one fails
      }
    }

    console.log('✅ Database schema initialized successfully!');
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('❌ Error initializing database schema:', error);
    return false;
  }
}

// Initialize the database on module load - but only once
(async () => {
  if (!isInitialized) {
    console.log("Initializing database...");
    await initializeDatabase();
  }
})();

// User related queries
export async function getUserByEmail(email: string) {
  const query = `
    SELECT * FROM users 
    WHERE email = ?
    LIMIT 1
  `

  const users = await executeQuery<any[]>({ query, values: [email] })
  return users[0]
}

export async function createUser({ name, email, passwordHash }: { name: string; email: string; passwordHash: string }) {
  const query = `
    INSERT INTO users (name, email, password_hash, created_at)
    VALUES (?, ?, ?, NOW())
  `

  return executeQuery({ query, values: [name, email, passwordHash] })
}

export async function updateUserWallet(userId: number, amount: number) {
  const query = `
    UPDATE users
    SET wallet_balance = wallet_balance + ?
    WHERE id = ?
  `

  return executeQuery({ query, values: [amount, userId] })
}

// Game related queries
export async function saveGameResult({
  userId,
  gameType,
  betAmount,
  winAmount,
  result,
}: {
  userId: number
  gameType: string
  betAmount: number
  winAmount: number
  result: "win" | "lose" | "draw"
}) {
  const query = `
    INSERT INTO game_history (user_id, game_type, bet_amount, win_amount, result, played_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `

  return executeQuery({
    query,
    values: [userId, gameType, betAmount, winAmount, result],
  })
}

export async function getUserGameHistory(userId: number, limit = 10) {
  const query = `
    SELECT * FROM game_history
    WHERE user_id = ?
    ORDER BY played_at DESC
    LIMIT ?
  `

  return executeQuery<any[]>({ query, values: [userId, limit] })
}

export async function getLeaderboard(timeframe: "daily" | "weekly" | "monthly" | "allTime", limit = 10) {
  let timeCondition = ""

  switch (timeframe) {
    case "daily":
      timeCondition = "AND DATE(played_at) = CURDATE()"
      break
    case "weekly":
      timeCondition = "AND played_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)"
      break
    case "monthly":
      timeCondition = "AND played_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)"
      break
    case "allTime":
    default:
      timeCondition = ""
      break
  }

  const query = `
    SELECT 
      u.id,
      u.name,
      u.avatar,
      SUM(CASE WHEN gh.result = 'win' THEN gh.win_amount ELSE 0 END) as total_winnings,
      COUNT(gh.id) as games_played,
      SUM(CASE WHEN gh.result = 'win' THEN 1 ELSE 0 END) / COUNT(gh.id) as win_rate
    FROM 
      users u
    JOIN 
      game_history gh ON u.id = gh.user_id
    WHERE 
      1=1 ${timeCondition}
    GROUP BY 
      u.id
    ORDER BY 
      total_winnings DESC
    LIMIT ?
  `

  return executeQuery<any[]>({ query, values: [limit] })
}

// Transaction related queries
export async function recordTransaction({
  userId,
  type,
  amount,
  gameId = null,
}: {
  userId: number
  type: "deposit" | "withdraw" | "bet" | "win" | "bonus"
  amount: number
  gameId?: number | null
}) {
  const query = `
    INSERT INTO transactions (user_id, type, amount, game_id, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `

  return executeQuery({ query, values: [userId, type, amount, gameId] })
}

export async function getUserTransactions(userId: number, limit = 10) {
  const query = `
    SELECT t.*, g.game_type
    FROM transactions t
    LEFT JOIN game_history g ON t.game_id = g.id
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
    LIMIT ?
  `

  return executeQuery<any[]>({ query, values: [userId, limit] })
}
