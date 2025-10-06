import FuzzyText from "@/components/FuzzyText";

const Notfound = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-1">
      <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
        404
      </FuzzyText>
      <FuzzyText
        baseIntensity={0.2}
        hoverIntensity={0.5}
        enableHover={true}
        fontSize={"3rem"}
      >
        NOT FOUND!
      </FuzzyText>
    </div>
  );
};

export default Notfound;
