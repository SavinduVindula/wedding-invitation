<?php
// backend/api/rsvp.php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST");

// Include database connection
require_once '../config/db.php';

// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Read the form data (could be sent as FormData or JSON, let's handle FormData since fetch API by default with FormData sends it as multipart)
    $name = isset($_POST['name']) ? trim($_POST['name']) : null;
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : null;
    $attendance = isset($_POST['attendance']) ? trim($_POST['attendance']) : null;
    
    // If sent as raw JSON (fallback)
    if (!$name) {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $name = isset($data['name']) ? trim($data['name']) : null;
        $phone = isset($data['phone']) ? trim($data['phone']) : null;
        $attendance = isset($data['attendance']) ? trim($data['attendance']) : null;
    }

    // Server-side validation
    if (empty($name) || empty($phone) || empty($attendance)) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit;
    }

    // Insert into DB avoiding SQL Injection by using prepared statements
    $tsql = "INSERT INTO Guests (name, phone, attending) VALUES (?, ?, ?)";
    $params = array($name, $phone, $attendance);

    $stmt = sqlsrv_query($conn, $tsql, $params);

    if ($stmt) {
        echo json_encode(["status" => "success", "message" => "RSVP submitted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to submit RSVP.", "errors" => sqlsrv_errors()]);
    }
    
    // Free statement and close connection
    sqlsrv_free_stmt($stmt);
    sqlsrv_close($conn);

} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
