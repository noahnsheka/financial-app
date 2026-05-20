        </main>

        <footer class="app-footer py-4">
            <div class="d-flex flex-column flex-lg-row justify-content-between gap-2">
                <p class="mb-0">MVP foundation for a government-facing fintech workflow focused on informal businesses in Uganda.</p>
                <small>Built to support onboarding, credit readiness, and pilot decision-making across the registry.</small>
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