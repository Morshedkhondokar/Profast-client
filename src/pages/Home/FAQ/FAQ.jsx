const FAQ = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="max-w-3xl mx-auto text-center  ">
        {/* title */}
        <h1 className="text-2xl md:text-4xl text-secondary font-extrabold">
          Frequently Asked Question (FAQ)
        </h1>
        {/* subtitle */}
        <p className="text-[#606060] text-sm md:text-xl mt-5 mb-10">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      {/*========= FAQ  ==========*/}
      {/* 1 */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input
          type="radio"
          name="my-accordion-2"
          defaultChecked
        />
        <div className="collapse-title font-semibold">
          How does this posture corrector work?
        </div>
        <div className="collapse-content text-sm">
          A posture corrector works by providing support and gentle alignment to
          your shoulders, back, and spine, encouraging you to maintain proper
          posture throughout the day. Here’s how it typically functions: A
          posture corrector works by providing support and gentle alignment to
          your shoulders.
        </div>
      </div>
      {/* 2 */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input
          type="radio"
          name="my-accordion-2"
        />
        <div className="collapse-title font-semibold">
          Is it suitable for all ages and body types?
        </div>
        <div className="collapse-content text-sm">
          Yes! Our posture corrector is designed with adjustable straps and
          flexible support, making it suitable for teens, adults, and seniors.
          It comfortably fits a wide range of body shapes and sizes, ensuring
          proper alignment without causing discomfort.
        </div>
      </div>
      {/* 3 */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input
          type="radio"
          name="my-accordion-2"
        />
        <div className="collapse-title font-semibold">
          Does it really help with back pain and posture improvement?
        </div>
        <div className="collapse-content text-sm">
          Absolutely. The posture corrector gently aligns your shoulders and
          spine, reducing slouching and minimizing unnecessary pressure on your
          back muscles. With consistent use, it helps relieve discomfort,
          strengthen posture habits, and improve overall spinal alignment.
        </div>
      </div>
      {/* 4 */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input
          type="radio"
          name="my-accordion-2"
        />
        <div className="collapse-title font-semibold">
          Does it have smart features like vibration alerts?
        </div>
        <div className="collapse-content text-sm">
          Yes, it includes a built-in smart reminder system that gently vibrates
          whenever you start slouching. This helps you stay aware of your
          posture throughout the day and build long-term healthy alignment
          habits without relying on constant manual correction.
        </div>
      </div>
      {/* 5 */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input
          type="radio"
          name="my-accordion-2"
        />
        <div className="collapse-title font-semibold">
          How will I be notified when the product is back in stock?
        </div>
        <div className="collapse-content text-sm">
          Once you enter your email or phone number on our “Back in Stock”
          notification form, you will automatically receive an alert as soon as
          the product becomes available again. You’ll get instant updates so you
          can place your order right away before the stock runs out again.
        </div>
      </div>
    </div>
  );
};

export default FAQ;
