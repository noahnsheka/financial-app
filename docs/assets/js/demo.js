const localStartCommand = 'powershell -ExecutionPolicy Bypass -File .\\run-local.ps1';

const copyCommandButton = document.querySelector('[data-copy-command]');
const runtimeNote = document.querySelector('[data-runtime-note]');

const setRuntimeNote = (message) => {
    if (runtimeNote) {
        runtimeNote.textContent = message;
    }
};

const buildRuntimeMessage = () => {
    const host = window.location.hostname || 'this host';

    if (host.includes('github.io')) {
        return 'You are viewing the informational Pages build. Open the live Render app above for the database-backed product.';
    }

    if (host === 'localhost' || host === '127.0.0.1') {
        return 'This static notice is local. Start the PHP and Django services from the repository root to use the real app.';
    }

    return 'Use the Render deployment above, or run the full stack locally from the repository root.';
};

setRuntimeNote(buildRuntimeMessage());

if (copyCommandButton && navigator.clipboard) {
    copyCommandButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(localStartCommand);
            setRuntimeNote('Local start command copied. Run it from the repository root to launch the real app.');
        } catch (error) {
            setRuntimeNote(`Copy failed. Run this manually: ${localStartCommand}`);
        }
    });
}