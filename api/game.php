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

if ($endpoint === '/api/game/properties' && $method === 'GET') {
    getProperties($pdo);
} elseif ($endpoint === '/api/game/buy' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    buyProperty($pdo, $data);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
}

function getProperties($pdo) {
    $stmt = $pdo->query("SELECT * FROM properties WHERE available = 1");
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'properties' => $properties]);
}

function buyProperty($pdo, $data) {
    if (empty($data['property_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Property ID is required']);
        return;
    }

    // In a real app, you would:
    // 1. Verify user has enough balance
    // 2. Process transaction
    // 3. Transfer ownership
    
    // Simplified version
    $stmt = $pdo->prepare("UPDATE properties SET available = 0 WHERE id = ?");
    $stmt->execute([$data['property_id']]);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Property purchased successfully']);
}
?>
