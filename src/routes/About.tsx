import { Card } from '@/components/ui/card';

const AboutPage = () => {
  return (
    <>
      <Card className="p-[16px]">
        <h1 className="text-2xl font-semibold">About CcTracker</h1>
        <p className="text-justify mx-auto">
          CcTracker is a dynamic, user-friendly web application currently in its
          beta version. It is built on the powerfully efficient JavaScript
          library, React, which provides the foundation for its interactive UI
          and ensures optimal performance. This web app is primarily designed to
          serve as a comprehensive platform for cryptocurrency enthusiasts. It
          leverages the extensive CoinGecko API, a reliable cryptocurrency
          market data provider, to fetch real-time data about most popular
          cryptocurrencies. Users can use this feature to keep track of their
          favorite cryptocurrencies, analyze market trends, and make informed
          decisions. One of the standout features of CcTracker is its innovative
          portfolio calculation tool. This capability allows users to manage
          their cryptocurrency investments efficiently. They can input the
          details about their cryptocurrency holdings, and the application
          provides them with a detailed analysis of their portfolio, including
          its current value and growth over time. In terms of data storage and
          security, CcTracker takes a privacy-focused approach. All user data is
          stored locally on their own computers, which eliminates the risk of
          data breaches and ensures that users have full control over their
          information. Moreover, the app offers the option for users to save
          their data on an external file. This feature not only provides an
          additional layer of security but also allows users to reuse their data
          when needed, making the app more flexible and adaptable to the user's
          needs. In summary, CcTracker is an all-inclusive, beta-version web app
          built in React for cryptocurrency enthusiasts. It offers a wide range
          of features, including real-time tracking of cryptocurrencies,
          portfolio calculation, and local data storage. Despite being in its
          beta version, it promises a secure, user-centric, and flexible
          platform for tracking and managing cryptocurrency investments.
        </p>

        <div className="m-[26px] ">
          <h2 className="font-bold">Coin Data powered by:</h2>
          <img
            className="mx-auto"
            src="https://static.coingecko.com/s/coingecko-branding-guide-8447de673439420efa0ab1e0e03a1f8b0137270fbc9c0b7c086ee284bd417fa1.png"
            alt="coinGecko logo"
            width={400}
          />
        </div>
      </Card>
    </>
  );
};

export default AboutPage;
