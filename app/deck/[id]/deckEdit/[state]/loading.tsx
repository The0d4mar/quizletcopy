import { SkeletonBlockProps } from "@/types/types.type";

const SkeletonBlock = ({ className = '' }: SkeletonBlockProps) => (
  <div
    className={`animate-pulse rounded-[var(--radiusCard)] bg-[var(--colorBorder)] ${className}`}
  />
);

const Loading = () => {
  return (
    <section className="min-h-screen w-full px-10 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <SkeletonBlock className="h-5 w-32 rounded-[var(--radiusPill)]" />

          <div className="flex items-center gap-5">
            <SkeletonBlock className="h-11 w-40 rounded-[var(--radiusPill)]" />
            <SkeletonBlock className="h-11 w-44 rounded-[var(--radiusPill)]" />
          </div>
        </div>

        <div className="mb-8 space-y-3">
          <div className="rounded-[var(--radiusLg)] border border-[var(--colorBorder)] bg-[var(--colorSurfaceMuted)] px-[var(--paddingCardX)] py-[var(--paddingCardY)]">
            <SkeletonBlock className="mb-3 h-3 w-20" />
            <SkeletonBlock className="h-7 w-64" />
          </div>

          <div className="listRow cardWithoutBg cardFlat justify-between">
            <SkeletonBlock className="h-5 w-44" />
            <SkeletonBlock className="h-6 w-11 rounded-[var(--radiusPill)]" />
          </div>

          <div className="min-h-[70px] rounded-[var(--radiusLg)] border border-[var(--colorBorder)] bg-[var(--colorSurfaceMuted)] px-[var(--paddingCardX)] py-[var(--paddingCardY)]">
            <SkeletonBlock className="mb-3 h-4 w-1/2" />
            <SkeletonBlock className="h-4 w-1/3" />
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className="rounded-2xl border border-[var(--colorBorder)] bg-[var(--colorSurface)] px-6 py-5"
            >
              <div className="mb-6 flex items-center justify-between">
                <SkeletonBlock className="h-5 w-5" />
                <SkeletonBlock className="h-9 w-9 rounded-lg" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <SkeletonBlock className="h-14 w-full rounded-lg bg-[var(--colorBg)]" />
                  <SkeletonBlock className="mt-3 h-3 w-20" />
                </div>

                <div>
                  <SkeletonBlock className="h-14 w-full rounded-lg bg-[var(--colorBg)]" />
                  <SkeletonBlock className="mt-3 h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center">
          <SkeletonBlock className="h-12 w-48" />
        </div>
      </div>
    </section>
  );
};

export default Loading;
