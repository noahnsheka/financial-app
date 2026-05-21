<section class="row g-4">
    <div class="col-lg-8">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                <div>
                    <p class="section-kicker mb-2">Registry explorer</p>
                    <h2 class="h4 mb-1">Browse live business registrations</h2>
                    <p class="text-muted mb-0"><span data-business-count>0</span> businesses currently visible in the registry.</p>
                </div>
                <div class="d-flex flex-column flex-sm-row gap-2 align-items-stretch">
                    <span class="pill-note pill-note-muted" data-business-sync-status>Checking live data...</span>
                    <a class="btn btn-outline-success btn-lg" href="?page=registration">New registration</a>
                    <div class="search-panel">
                        <input type="search" class="form-control form-control-lg" data-business-search placeholder="Search by business, district, or sector">
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Business</th>
                            <th>District</th>
                            <th>Sector</th>
                            <th>Revenue band</th>
                            <th>Profile</th>
                            <th>Tax status</th>
                        </tr>
                    </thead>
                    <tbody data-business-list>
                        <tr>
                            <td colspan="6" class="text-muted">Loading registrations...</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="empty-state mt-4" data-business-empty>
                No live businesses match the current search.
            </div>
        </article>
    </div>

    <div class="col-lg-4">
        <article class="panel mb-4">
            <p class="section-kicker mb-2">Readiness markers</p>
            <h2 class="h4 mb-4">What this MVP tracks per shop</h2>
            <div class="business-card mb-3">
                <strong class="d-block mb-2">Profile and credit score</strong>
                <p class="mb-0 text-muted">The registry now separates completeness from lender-facing credit percentage so officials can see who is documented and who is actually ready.</p>
            </div>
            <div class="business-card mb-3">
                <strong class="d-block mb-2">Identity and fraud watch</strong>
                <p class="mb-0 text-muted">NIN verification state, receipt trust, and consistency checks help flag businesses that need extra review before finance is offered.</p>
            </div>
            <div class="business-card">
                <strong class="d-block mb-2">Operating evidence</strong>
                <p class="mb-0 text-muted">Receipt totals, profit reporting, stock values, and mobile money now feed the live risk and readiness analytics.</p>
            </div>
        </article>

        <article class="panel">
            <p class="section-kicker mb-2">Best profiles</p>
            <h2 class="h4 mb-4">Top registrations right now</h2>
            <div class="registration-feed" data-top-businesses>
                Loading the strongest registrations...
            </div>
        </article>
    </div>
</section>