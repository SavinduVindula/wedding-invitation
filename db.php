<?php
// backend/config/db.php

// Update these details with your local Microsoft SQL Server settings
$serverName = "DESKTOP-KP98I9Q\\SQLEXPRESS"; 
$database = "WeddingApp";

// Since XAMPP is typical with basic auth but Windows Auth is common for SSMS:
// If using Windows Authentication on local SQL server, omit UID and PWD.
$connectionOptions = array(
    "Database" => $database,
    // "Uid" => "your_username",
    // "PWD" => "your_password",
    "TrustServerCertificate" => "yes",
    "CharacterSet" => "UTF-8"
);

// Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);

if ($conn === false) {
    // Return connection error securely without exposing too much detail to frontend
    die(json_encode([
        "status" => "error", 
        "message" => "Database connection could not be established.",
        // Uncomment out the line below to debug sqlsrv errors
        // "errors" => sqlsrv_errors()
    ]));
}
?>
