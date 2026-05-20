<section class="row g-3 mb-3">
    <div class="col-lg-7">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">District performance</p>
                    <h2 class="h4 mb-1">Average score by pilot district</h2>
                    <p class="text-muted mb-0">This snapshot helps government teams see where digital record quality is strong enough for financing and formalization programs.</p>
                </div>
                <span class="pill-note align-self-start">Pilot benchmark</span>
            </div>
            <div class="chart-frame chart-frame-wide">
                <canvas id="districtScoreChart"></canvas>
            </div>
        </article>
    </div>

    <div class="col-lg-5">
        <article class="panel h-100">
            <p class="section-kicker mb-2">Policy watchlist</p>
            <h2 class="h4 mb-3">Signals that need action</h2>
            <?php foreach ($data['watchlist'] as $item): ?>
                <div class="watchlist-item">
                    <strong class="d-block mb-2"><?php echo e($item['title']); ?></strong>
                    <p class="mb-0 text-muted"><?php echo e($item['detail']); ?></p>
                </div>
            <?php endforeach; ?>
        </article>
    </div>
</section>

<section class="row g-3">
    <div class="col-lg-8">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">District registry</p>
                    <h2 class="h4 mb-1">Where the pilot is performing today</h2>
                    <p class="text-muted mb-0">Use this table to decide which districts need training, digital onboarding, or lender engagement next.</p>
                </div>
                <span class="pill-note align-self-start"><?php echo e(count($data['districtInsights'])); ?> districts visible</span>
            </div>

            <div class="table-responsive">
                <table class="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>District</th>
                            <th>Businesses</th>
                            <th>Average score</th>
                            <th>Digitization</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($data['districtInsights'] as $district): ?>
                            <tr>
                                <td><?php echo e($district['district']); ?></td>
                                <td><?php echo e($district['businesses']); ?></td>
                                <td><?php echo e($district['avgScore']); ?>/100</td>
                                <td><?php echo e($district['digitization']); ?></td>
                                <td><?php echo e($district['priority']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </article>
    </div>

    <div class="col-lg-4">
        <article class="panel h-100">
            <p class="section-kicker mb-2">Recommended interventions</p>
            <h2 class="h4 mb-3">How to expand the program</h2>
            <?php foreach ($data['interventions'] as $intervention): ?>
                <div class="business-card mb-3">
                    <strong class="d-block mb-2"><?php echo e($intervention['title']); ?></strong>
                    <p class="mb-0 text-muted"><?php echo e($intervention['detail']); ?></p>
                </div>
            <?php endforeach; ?>
        </article>
    </div>
</section>