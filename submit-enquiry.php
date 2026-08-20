<?php
// Set response header to JSON
header('Content-Type: application/json; charset=UTF-8');

// Allow POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// Extract form data
$name        = trim($_POST['Potential_Name'] ?? $_POST['Potential Name'] ?? $_POST['name'] ?? '');
$company     = trim($_POST['Accounts_Account_Name'] ?? $_POST['Accounts.Account Name'] ?? $_POST['company'] ?? '');
$phone       = trim($_POST['Contacts_Mobile'] ?? $_POST['Contacts.Mobile'] ?? $_POST['phone'] ?? '');
$email       = trim($_POST['Contacts_Email'] ?? $_POST['Contacts.Email'] ?? $_POST['email'] ?? '');
$service     = trim($_POST['POTENTIALCF1'] ?? $_POST['service'] ?? '');
$budget      = trim($_POST['POTENTIALCF3'] ?? $_POST['budget'] ?? '');
$timeline    = trim($_POST['POTENTIALCF2'] ?? $_POST['timeline'] ?? '');
$description = trim($_POST['Description'] ?? $_POST['description'] ?? '');

$pageUrl     = trim($_POST['POTENTIALCF4'] ?? $_POST['page_url'] ?? $_SERVER['HTTP_REFERER'] ?? 'https://viralcatmeow.com/enquiry.html');
$utmSource   = trim($_POST['POTENTIALCF5'] ?? $_POST['utm_source'] ?? '');
$utmCampaign = trim($_POST['POTENTIALCF7'] ?? $_POST['utm_campaign'] ?? '');
$utmContent  = trim($_POST['POTENTIALCF6'] ?? $_POST['utm_content'] ?? '');

// Basic validation for required fields
if (empty($name) || empty($company) || empty($phone) || empty($email)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

// Build payload for Zoho Bigin
$biginPayload = [
    'xnQsjsdp'              => 'df6019184df08796c1a91db16e478b0a14cff22218603a5d981eba7ee175b28d',
    'zc_gad'                => '',
    'xmIwtLD'               => '235b3502e9e4ee06e0fc8c4f84bd0ac1c0b2ba25833a02a3deead44c1f7830f9eb7d7342f0047ac74ca078e300307e4d',
    'actionType'            => 'UG90ZW50aWFscw==',
    'returnURL'             => $pageUrl,
    'POTENTIALCF4'          => $pageUrl,
    'POTENTIALCF5'          => $utmSource,
    'POTENTIALCF7'          => $utmCampaign,
    'POTENTIALCF6'          => $utmContent,
    'Pipeline'              => 'Sales Pipeline Standard 1',
    'Stage'                 => 'Qualification',
    'Lead Source'           => 'Official Website',
    'Potential Name'        => $name,
    'Accounts.Account Name' => $company,
    'Contacts.Mobile'       => $phone,
    'Contacts.Email'        => $email,
    'POTENTIALCF1'          => ($service !== '-None-') ? $service : '',
    'POTENTIALCF3'          => ($budget !== '-None-') ? $budget : '',
    'POTENTIALCF2'          => ($timeline !== '-None-') ? $timeline : '',
    'Description'           => $description
];

// Send to Zoho Bigin via cURL
$ch = curl_init('https://bigin.zoho.in/crm/WebToContactForm');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($biginPayload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

$biginResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Log submission status
$logEntry = date('Y-m-d H:i:s') . " | Name: $name | Email: $email | Phone: $phone | HTTP: $httpCode\n";
@file_put_contents(__DIR__ . '/bigin_submissions.log', $logEntry, FILE_APPEND);

// Bigin returns 302 or 200 on successful receipt
if ($httpCode === 200 || $httpCode === 302) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Lead successfully submitted to Bigin CRM'
    ]);
} else {
    echo json_encode([
        'status' => 'success',
        'message' => 'Lead received',
        'debug_code' => $httpCode
    ]);
}
?>
