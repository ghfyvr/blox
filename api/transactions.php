<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../vendor/autoload.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verify JWT (in a real app)
function verifyToken($token) {
    // Simplified verification. In production, use a JWT library.
    return !empty($token);
}

// Get authorization header
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

if (!verifyToken($token)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// Database configuration
$dbHost = 'localhost';
$dbName = 'bloxland';
$dbUser = 'root';
$dbPass = 'password';

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

// Route the request
$endpoint = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

if ($endpoint === '/api/transactions/history' && $method === 'GET') {
    getTransactionHistory($pdo);
} elseif ($endpoint === '/api/transactions/withdraw' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    withdrawFunds($pdo, $data);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
}

function getTransactionHistory($pdo) {
    // In a real app, you would filter by user ID from JWT
    $stmt = $pdo->query("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10");
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'transactions' => $transactions]);
}

function withdrawFunds($pdo, $data) {
    if (empty($data['amount']) || empty($data['wallet_address'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Amount and wallet address are required']);
        return;
    }

    // In a real app, you would:
    // 1. Verify user has enough balance
    // 2. Process withdrawal request
    // 3. Record transaction
    
    // Simplified version
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Withdrawal request submitted']);
}
?>
