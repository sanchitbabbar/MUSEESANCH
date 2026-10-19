<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, no-store');
header('Vary: CF-IPCountry');
header('X-Content-Type-Options: nosniff');
$country = strtoupper(trim($_SERVER['HTTP_CF_IPCOUNTRY'] ?? ''));
echo json_encode(['language' => $country === 'FR' ? 'fr' : 'en']);
