import location from  '../../../assets/location-merchant.png'

const BeMerchant = () => {
  return (
    <div className="bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-[#03373D] rounded-4xl mx-2 lg:p-20">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src={location}
          className="max-w-sm"
        />
        <div>
          <h1 className="text-xl md:text-5xl font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <button className="btn btn-primary rounded-full text-black text-xs md:text-sm">Become a Merchant</button>
          <button className="btn btn-primary btn-outline rounded-full ms-4 text-xs md:text-sm">Earn with Profast Courier</button>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
