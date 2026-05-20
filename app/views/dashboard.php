<section class="row g-3 mb-3">
    <?php foreach ($data['metrics'] as $metric): ?>
        <div class="col-sm-6 col-xl-3">
            <article class="panel metric-card h-100">
                <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2"><?php echo e($metric['label']); ?></p>
                        <h2 class="metric-value mb-2"><?php echo e($metric['value']); ?></h2>
                        <p class="metric-delta mb-0"><?php echo e($metric['delta']); ?></p>
                    </div>
                    <span class="metric-icon metric-icon-<?php echo e($metric['tone']); ?>">
                        <i class="bi bi-<?php echo e($metric['icon']); ?>"></i>
                    </span>
                </div>
            </article>
        </div>
    <?php endforeach; ?>
</section>

<section class="row g-3 mb-3">
    <div class="col-lg-8">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">Revenue signal</p>
                    <h2 class="h4 mb-1">Mobile money is becoming the core evidence trail</h2>
                    <p class="text-muted mb-0">The strongest shops are shifting toward digital payment capture while supplier activity grows in parallel.</p>
                </div>
                <span class="pill-note align-self-start">6-month trend</span>
            </div>
            <div class="chart-frame chart-frame-wide">
                <canvas id="revenueTrendChart"></canvas>
            </div>
        </article>
    </div>

    <div class="col-lg-4">
        <article class="panel h-100">
            <p class="section-kicker mb-2">Inventory mix</p>
            <h2 class="h4 mb-1">Fast-moving categories driving the pilot</h2>
            <p class="text-muted mb-3">Groceries and beverages dominate the earliest onboarding wave, which makes stock monitoring a core risk control.</p>
            <div class="chart-frame chart-frame-tall">
                <canvas id="inventoryMixChart"></canvas>
            </div>
        </article>
    </div>
</section>

<section class="row g-3">
    <div class="col-lg-7">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">Stock watch</p>
                    <h2 class="h4 mb-1">Businesses that need immediate follow-up</h2>
                    <p class="text-muted mb-0">Low inventory visibility will weaken both score quality and business continuity unless field teams intervene early.</p>
                </div>
                <span class="pill-note align-self-start"><?php echo e(count($data['stockAlerts'])); ?> open alerts</span>
            </div>

            <div class="table-responsive">
                <table class="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Business</th>
                            <th>District</th>
                            <th>Category</th>
                            <th>Coverage</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($data['stockAlerts'] as $alert): ?>
                            <tr>
                                <td><?php echo e($alert['business']); ?></td>
                                <td><?php echo e($alert['district']); ?></td>
                                <td><?php echo e($alert['category']); ?></td>
                                <td><?php echo e($alert['days']); ?></td>
                                <td>
                                    <span class="status-pill status-pill-<?php echo strtolower(e($alert['severity'])); ?>">
                                        <?php echo e($alert['severity']); ?>
                                    </span>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </article>
    </div>

    <div class="col-lg-5">
        <article class="panel h-100">
            <p class="section-kicker mb-2">What to do next</p>
            <h2 class="h4 mb-3">MVP operating checklist</h2>
            <ul class="list-check">
                <li>Capture mobile money references and supplier payments in one ledger so the score is based on verified activity.</li>
                <li>Flag stock-outs before they hurt revenue patterns, because missing inventory data quickly becomes missing credit evidence.</li>
                <li>Segment shops by district and sector so government teams can target support where adoption is weakest.</li>
                <li>Use the strongest digital histories to pilot small working-capital loans before expanding nationally.</li>
            </ul>
        </article>
    </div>
</section>