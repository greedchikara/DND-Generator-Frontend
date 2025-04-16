const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-lg font-semibold text-blue-600 animate-pulse">
            Generating your description...
        </div>
    </div>
);

export default LoadingOverlay;