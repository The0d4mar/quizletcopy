const Loading = () => {
  return (
    <div className="min-h-screen text-white">
      
      <main className="relative flex">
    

        {/* CONTENT */}
        <section className="flex-1">
          {/* BUTTON */}
          <div className="mb-10">
            <div className="h-12 w-44 animate-pulse rounded-2xl bg-neutral-800" />
          </div>

          {/* DECK CARDS */}
          <div className="grid gap-3">
           
            {[1, 2, 3, 4, 5].map(card => (
              <div
                key={card}
                className="inline-flex w-fit gap-5 items-center border border-white rounded-2xl px-3 py-4"
              >
                <div className="">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-800" />
                </div>

                <div className='flex flex-col justify-start gap-2'>
                    <h2 className='h-6 w-[191px] animate-pulse rounded bg-neutral-800'></h2>
                    <div className='flex items-center gap-5'>
                        <p className='h-4 w-[86px] animate-pulse rounded bg-neutral-900'></p>
                        <p className='h-4 w-[86px] animate-pulse rounded bg-neutral-900'></p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Loading;
