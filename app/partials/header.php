<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo e($documentTitle); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="assets/css/app.css" rel="stylesheet">
</head>
<body class="auth-pending" data-page="<?php echo e($activePage); ?>">
    <div class="page-backdrop"></div>
    <div class="page-glow page-glow-one"></div>
    <div class="page-glow page-glow-two"></div>

    <?php
    $primaryNavKeys = ['dashboard', 'businesses', 'registration'];
    $primaryPages = [];
    $secondaryPages = [];

    foreach ($pages as $pageKey => $config) {
        if (($config['nav'] ?? true) !== true) {
            continue;
        }

        if (in_array($pageKey, $primaryNavKeys, true)) {
            $primaryPages[$pageKey] = $config;
            continue;
        }

        $secondaryPages[$pageKey] = $config;
    }

    $sidebarButtonClass = array_key_exists($activePage, $secondaryPages) ? 'btn-warning text-dark' : 'btn-outline-dark';
    ?>

    <div class="container-fluid py-3 py-lg-4 position-relative app-shell">
        <header class="mb-3">
            <nav class="navbar navbar-expand-lg app-navbar px-3 px-lg-4 py-3">
                <a class="navbar-brand d-flex align-items-center gap-3" href="index.php">
                    <span class="brand-mark">LL</span>
                    <span class="brand-meta">
                        <strong class="d-block text-dark brand-name"><?php echo e($data['appName']); ?></strong>
                        <small class="text-muted brand-tagline"><?php echo e($data['tagline']); ?></small>
                    </span>
                </a>

                <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#appNav" aria-controls="appNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="appNav">
                    <div class="navbar-nav primary-nav ms-auto gap-lg-2">
                        <?php foreach ($primaryPages as $pageKey => $config): ?>
                            <?php $href = $pageKey === 'dashboard' ? 'index.php' : '?page=' . rawurlencode($pageKey); ?>
                            <a class="nav-link app-nav-link <?php echo $activePage === $pageKey ? 'active' : ''; ?>" href="<?php echo e($href); ?>">
                                <?php echo e($config['label']); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>

                    <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-2 ms-lg-3 pt-3 pt-lg-0 auth-nav-actions">
                        <?php if ($secondaryPages !== []): ?>
                            <button class="btn <?php echo e($sidebarButtonClass); ?> btn-sm px-3 nav-sidebar-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#appSidebar" aria-controls="appSidebar">
                                More
                            </button>
                        <?php endif; ?>
                        <a class="btn btn-outline-success btn-sm px-3" href="?page=login" data-login-link>Login</a>
                        <button class="btn btn-link btn-sm px-2 text-decoration-none d-none" type="button" data-logout-button>Logout</button>
                    </div>
                </div>
            </nav>

            <?php if ($secondaryPages !== []): ?>
                <div class="offcanvas offcanvas-end nav-sidebar" tabindex="-1" id="appSidebar" aria-labelledby="appSidebarLabel">
                    <div class="offcanvas-header px-3 px-lg-4">
                        <div>
                            <p class="section-kicker mb-2">More navigation</p>
                            <h2 class="h5 mb-0" id="appSidebarLabel">Additional sections</h2>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body px-3 px-lg-4">
                        <div class="nav-sidebar-session">
                            <span class="auth-chip d-none" data-auth-status></span>
                            <a class="btn btn-warning btn-sm px-3 d-none" href="?page=workspace" data-workspace-link>Workspace</a>
                        </div>
                        <div class="nav-sidebar-list">
                            <?php foreach ($secondaryPages as $pageKey => $config): ?>
                                <?php $href = $pageKey === 'dashboard' ? 'index.php' : '?page=' . rawurlencode($pageKey); ?>
                                <a class="nav-sidebar-link <?php echo $activePage === $pageKey ? 'active' : ''; ?>" href="<?php echo e($href); ?>">
                                    <span class="fw-semibold d-block"><?php echo e($config['label']); ?></span>
                                    <small class="text-muted"><?php echo e($config['eyebrow']); ?></small>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </header>

        <?php if ($activePage === 'dashboard'): ?>
            <section class="hero-panel mb-3">
                <div class="row align-items-center g-3">
                    <div class="col-lg-7">
                        <span class="eyebrow"><?php echo e($pageConfig['eyebrow']); ?></span>
                        <h1 class="display-6 fw-semibold text-white mb-3"><?php echo e($pageConfig['title']); ?></h1>
                        <p class="lead text-white-50 mb-3 hero-copy"><?php echo e($pageConfig['description']); ?></p>
                        <div class="d-flex flex-wrap gap-3">
                            <a class="btn btn-warning px-4" href="?page=login" data-dashboard-primary-cta>Log in</a>
                            <a class="btn btn-outline-light px-4" href="?page=login#register-account" data-dashboard-secondary-cta>Create account</a>
                        </div>
                    </div>

                    <div class="col-lg-5">
                        <div class="hero-card">
                            <p class="section-kicker mb-3">Pilot pulse</p>
                            <div class="row g-3">
                                <?php foreach ($data['heroStats'] as $stat): ?>
                                    <div class="col-6">
                                        <div class="stat-chip h-100">
                                            <strong><?php echo e($stat['value']); ?></strong>
                                            <span><?php echo e($stat['label']); ?></span>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            <div class="hero-note mt-3">
                                <strong class="d-block mb-2">Pilot objective</strong>
                                <p class="mb-0 text-muted">Build enough financial visibility for government teams and lenders to move high-potential small shops toward formal credit access.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <main class="pb-4">