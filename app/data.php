<?php
declare(strict_types=1);

function normalizeApiBaseUrl(string $value): string
{
    return rtrim(trim($value), '/');
}

function requestHostName(): string
{
    $host = $_SERVER['HTTP_HOST'] ?? '127.0.0.1';
    return (string) preg_replace('/:\\d+$/', '', $host);
}

function isLocalRequestHost(string $host): bool
{
    return in_array($host, ['127.0.0.1', 'localhost'], true);
}

$requestHost = requestHostName();
$defaultPublicApiBaseUrl = isLocalRequestHost($requestHost) ? 'http://127.0.0.1:8001/api' : '/api';
$publicApiBaseUrl = normalizeApiBaseUrl(getenv('LEDGERLIFT_API_BASE_URL') ?: $defaultPublicApiBaseUrl);
$internalApiBaseUrl = normalizeApiBaseUrl(
    getenv('LEDGERLIFT_INTERNAL_API_BASE_URL') ?: 'http://127.0.0.1:8001/api'
);

function fetchApiPayload(string $url): array
{
    $context = stream_context_create([
        'http' => [
            'ignore_errors' => true,
            'method' => 'GET',
            'timeout' => 5,
        ],
    ]);

    $raw = @file_get_contents($url, false, $context);
    if ($raw === false || $raw === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

$bootstrap = fetchApiPayload($internalApiBaseUrl . '/platform/bootstrap/');

return [
    'appName' => 'LedgerLift Uganda',
    'tagline' => 'Credit-ready records for informal businesses',
    'apiBaseUrl' => $publicApiBaseUrl,
    'registrationForm' => $bootstrap['registrationForm'] ?? [
        'districts' => [],
        'sectors' => [],
        'revenueBands' => [],
    ],
    'demoAccounts' => [],
    'heroStats' => $bootstrap['heroStats'] ?? [],
    'metrics' => $bootstrap['metrics'] ?? [],
    'collections' => $bootstrap['collections'] ?? [
        'labels' => [],
        'mobileMoney' => [],
        'cash' => [],
        'supplierPayments' => [],
    ],
    'inventoryMix' => $bootstrap['inventoryMix'] ?? [
        'labels' => [],
        'values' => [],
    ],
    'scoreTrend' => $bootstrap['scoreTrend'] ?? [
        'labels' => [],
        'values' => [],
    ],
    'districtPerformance' => $bootstrap['districtPerformance'] ?? [
        'labels' => [],
        'scores' => [],
    ],
    'stockAlerts' => $bootstrap['stockAlerts'] ?? [],
    'businesses' => [],
    'scoreBreakdown' => $bootstrap['scoreBreakdown'] ?? [],
    'loanPrograms' => $bootstrap['loanPrograms'] ?? [],
    'districtInsights' => [],
    'watchlist' => $bootstrap['watchlist'] ?? [],
    'interventions' => $bootstrap['interventions'] ?? [],
];