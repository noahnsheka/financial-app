<section class="row g-3 mb-3">
    <?php foreach ($data['scoreBreakdown'] as $signal): ?>
        <div class="col-md-6 col-xl-3">
            <article class="panel h-100">
                <p class="section-kicker mb-2"><?php echo e($signal['weight']); ?></p>
                <h2 class="h5 mb-3"><?php echo e($signal['name']); ?></h2>
                <p class="text-muted mb-0"><?php echo e($signal['description']); ?></p>
            </article>
        </div>
    <?php endforeach; ?>
</section>

<section class="row g-3 mb-3">
    <div class="col-lg-7">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">Credit trend</p>
                    <h2 class="h4 mb-1">The score improves as records become more complete</h2>
                    <p class="text-muted mb-0">This chart is a placeholder for the scoring pipeline you can later back with real payment, stock, and repayment data.</p>
                </div>
                <span class="pill-note align-self-start">6-week model view</span>
            </div>
            <div class="chart-frame chart-frame-wide">
                <canvas id="repaymentTrendChart"></canvas>
            </div>
        </article>
    </div>

    <div class="col-lg-5">
        <article class="panel h-100">
            <p class="section-kicker mb-2">Lender channels</p>
            <h2 class="h4 mb-3">Sample facilities for the MVP</h2>

            <div class="table-responsive">
                <table class="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Provider</th>
                            <th>Ticket size</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($data['loanPrograms'] as $program): ?>
                            <tr>
                                <td>
                                    <strong class="d-block"><?php echo e($program['provider']); ?></strong>
                                    <span class="text-muted small"><?php echo e($program['requirement']); ?></span>
                                </td>
                                <td><?php echo e($program['size']); ?></td>
                                <td><span class="pill-note"><?php echo e($program['status']); ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </article>
    </div>
</section>

<section class="row g-3">
    <div class="col-lg-12">
        <article class="panel">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">Early applicants</p>
                    <h2 class="h4 mb-1">Businesses that could move into a first loan cohort</h2>
                    <p class="text-muted mb-0">These cards show how the same captured operating data can become an underwriting summary.</p>
                </div>
                <span class="pill-note align-self-start">Pilot shortlist</span>
            </div>

            <div class="row g-3">
                <?php foreach (array_slice($data['businesses'], 0, 3) as $business): ?>
                    <div class="col-md-6 col-xl-4">
                        <div class="business-card h-100">
                            <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                                <div>
                                    <strong class="d-block mb-1"><?php echo e($business['name']); ?></strong>
                                    <span class="text-muted small"><?php echo e($business['sector']); ?> in <?php echo e($business['district']); ?></span>
                                </div>
                                <span class="metric-icon metric-icon-forest small-icon">
                                    <i class="bi bi-shield-check"></i>
                                </span>
                            </div>
                            <div class="d-flex justify-content-between text-muted small mb-2">
                                <span>Daily revenue</span>
                                <span><?php echo e($business['dailyRevenue']); ?></span>
                            </div>
                            <div class="d-flex justify-content-between text-muted small mb-2">
                                <span>Digitization</span>
                                <span><?php echo e($business['digitization']); ?></span>
                            </div>
                            <div class="d-flex justify-content-between text-muted small mb-3">
                                <span>Reliability</span>
                                <span><?php echo e($business['reliability']); ?></span>
                            </div>
                            <div class="progress score-progress mb-2">
                                <div class="progress-bar" role="progressbar" style="width: <?php echo e($business['score']); ?>%" aria-valuenow="<?php echo e($business['score']); ?>" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <div class="small fw-semibold"><?php echo e($business['score']); ?>/100 readiness</div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </article>
    </div>
</section>