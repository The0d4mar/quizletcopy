import React from 'react';




const Loading = () => {
  return (
    <section className="w-full px-8 py-6">
      <div className="mb-8 h-8 w-64 animate-pulse rounded bg-[var(--colorBorder)]" />

      <div className="mx-auto h-[320px] max-w-3xl animate-pulse rounded-3xl bg-[var(--colorBorder)]" />

      <div className="mx-auto mt-6 flex max-w-3xl justify-between">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--colorBorder)]" />
        <div className="h-6 w-20 animate-pulse rounded bg-[var(--colorBorder)]" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--colorBorder)]" />
      </div>
    </section>
  );
};

export default Loading;