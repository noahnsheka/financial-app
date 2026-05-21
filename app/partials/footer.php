        </main>

        <footer class="app-footer py-4">
            <div class="app-footer-card">
                <div class="app-footer-grid">
                    <div>
                        <p class="section-kicker mb-2">Platform service</p>
                        <strong class="app-footer-heading d-block mb-2">LedgerLift Uganda Pilot</strong>
                        <p class="mb-0">Digital support for business onboarding, credit-readiness review, and public-sector monitoring workflows.</p>
                    </div>
                    <div>
                        <p class="section-kicker mb-2">Ownership</p>
                        <p class="mb-1">Copyright &copy; <?php echo date('Y'); ?> Altira. All rights reserved.</p>
                        <p class="mb-0">Product delivery and platform stewardship by Altira.</p>
                    </div>
                    <div>
                        <p class="section-kicker mb-2">Use and support</p>
                        <p class="mb-1">Authorized pilot use only.</p>
                        <p class="mb-0">For access or operational support, contact your designated programme administrator.</p>
                    </div>
                </div>
                <div class="app-footer-divider"></div>
                <p class="app-footer-note mb-0">Information submitted through this service should be handled in line with applicable privacy, records-management, and audit requirements.</p>
            </div>
        </footer>
    </div>

    <script>
        window.finTrackData = <?php echo json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>