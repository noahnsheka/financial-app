<section class="row g-3 mb-3" data-dashboard-metrics>
    <div class="col-12 text-muted">Loading live dashboard metrics...</div>
</section>

<section class="row g-3 mb-3">
    <div class="col-lg-8">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">Revenue signal</p>
                    <h2 class="h4 mb-1">Recorded revenue, expense, and mobile-money trends</h2>
                    <p class="text-muted mb-0">This view now reflects the operating figures currently stored in the database instead of a seeded showcase trend.</p>
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
                    <h2 class="h4 mb-1">Business segments captured in the registry</h2>
                    <p class="text-muted mb-3">Sector mix is now calculated from the current database-backed business records.</p>
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
                    <h2 class="h4 mb-1">Businesses that need follow-up now</h2>
                    <p class="text-muted mb-0">These follow-up rows are generated from the latest operating evidence stored in the database.</p>
                </div>
                <span class="pill-note align-self-start" data-dashboard-alert-count>Loading alerts...</span>
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
                    <tbody data-dashboard-stock-alerts>
                        <tr>
                            <td colspan="5" class="text-muted">Loading live follow-up alerts...</td>
                        </tr>
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