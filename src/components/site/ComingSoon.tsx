export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <h1 className="text-lg font-medium text-white/60">{title}</h1>
      <p className="text-sm text-white/20">Coming soon.</p>
    </div>
  );
}
