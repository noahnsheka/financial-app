<?php
declare(strict_types=1);

$data = require __DIR__ . '/app/data.php';

function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

$pages = [
    'dashboard' => [
        'label' => 'Dashboard',
        'eyebrow' => 'Government pilot overview',
        'title' => 'Informal business intelligence for Uganda',
        'description' => 'Monitor small-shop cash flow, stock pressure, and credit readiness in one place before turning the pilot into a production platform.',
    ],
    'businesses' => [
        'label' => 'Businesses',
        'eyebrow' => 'Field operations registry',
        'title' => 'Review businesses at the individual shop level',
        'description' => 'Search the pilot registry, compare risk indicators, and spot which businesses are keeping reliable digital records.',
    ],
    'registration' => [
        'label' => 'Registration',
        'eyebrow' => 'Business onboarding',
        'title' => 'Register new informal businesses into the pilot',
        'description' => 'Capture shop details, mobile money references, and TIN data in one place so the live registry, owner workspace, and credit views stay in sync.',
    ],
    'login' => [
        'label' => 'Login',
        'eyebrow' => 'Access portal',
        'title' => 'Sign in to the live platform',
        'description' => 'Use a real account so each role opens the right live workspace against the connected backend.',
        'nav' => false,
    ],
    'workspace' => [
        'label' => 'Workspace',
        'eyebrow' => 'Role workspace',
        'title' => 'Open the role-based control room for the pilot',
        'description' => 'After sign-in, each role gets a focused live workspace with backend-backed businesses, actions, and next steps.',
        'nav' => false,
    ],
    'credit' => [
        'label' => 'Credit Engine',
        'eyebrow' => 'Loan readiness model',
        'title' => 'Translate shop records into lender-ready credit signals',
        'description' => 'Combine payment consistency, stock discipline, and operating resilience into an MVP score that lenders and government programs can understand.',
    ],
    'government' => [
        'label' => 'Government View',
        'eyebrow' => 'Policy and oversight',
        'title' => 'Surface where intervention will matter most',
        'description' => 'Use aggregated district-level patterns to decide where compliance support, digital onboarding, or financing programs should go next.',
    ],
];

$activePage = isset($_GET['page']) ? (string) $_GET['page'] : 'dashboard';
$notFound = false;

if (!array_key_exists($activePage, $pages)) {
    $activePage = 'dashboard';
    $notFound = true;
    http_response_code(404);
}

$pageConfig = $pages[$activePage];
$documentTitle = $pageConfig['label'] . ' | ' . $data['appName'];

require __DIR__ . '/app/partials/header.php';

if ($notFound) {
    echo '<div class="alert alert-warning border-0 shadow-sm mb-4">The section you requested does not exist yet. Showing the dashboard instead.</div>';
}

require __DIR__ . '/app/views/' . $activePage . '.php';
require __DIR__ . '/app/partials/footer.php';