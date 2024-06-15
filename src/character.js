import { useState, useEffect, useCallback } from "react";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts";

function Character({ val }) {
  const [stats, setStats] = useState(
    ATTRIBUTE_LIST.reduce((state, attr) => {
      state[attr.toLowerCase()] = { value: 10, modifier: 0 };
      return state;
    }, {}),
  );
  const [skills, setSkills] = useState(() => {
    const initialSkills = {};
    SKILL_LIST.forEach((skill) => {
      initialSkills[skill.name.toLowerCase().replace(/\s+/g, "-")] = 0;
    });
    return initialSkills;
  });
  const [classSelected, setClassSelected] = useState(null);
  const [classAttributes, setClassAttributes] = useState({});
  const [availableSkillsPoint, setAvailableSkillsPoint] = useState(10);
  const [qualifiedClass, setQualifiedClass] = useState(
    Object.keys(CLASS_LIST).map((className) => {
      return {
        [className]: false,
      };
    }),
  );
  const calculateLinkedValue = (value) => Math.floor((value - 10) / 2);

  let classQualCheck = useCallback(() => {
    const total = Object.keys(CLASS_LIST).reduce((acc, className) => {
      acc[className] = ATTRIBUTE_LIST.length;
      return acc;
    }, {});
    ATTRIBUTE_LIST.forEach((attr) => {
      if (stats[attr.toLowerCase()].value >= CLASS_LIST.Bard[attr]) {
        total.Bard -= 1;
      }
      if (stats[attr.toLowerCase()].value >= CLASS_LIST.Wizard[attr]) {
        total.Wizard -= 1;
      }
      if (stats[attr.toLowerCase()].value >= CLASS_LIST.Barbarian[attr]) {
        total.Barbarian -= 1;
      }
    });

    setQualifiedClass({
      Wizard: total.Wizard === 0 ? true : false,
      Bard: total.Bard === 0 ? true : false,
      Barbarian: total.Barbarian === 0 ? true : false,
    });
  }, [stats]);

  const increaseAttribute = (attr) => {
    setStats((prevStats) => {
      const newTotal =
        Object.values(prevStats).reduce((acc, cur) => acc + cur.value, 0) + 1;

      if (newTotal > 70) {
        alert("Exceeding the maximum allowed total of 70.");
        return prevStats;
      }
      const newVal = prevStats[attr].value + 1;
      const newModifierVal = calculateLinkedValue(newVal);
      return {
        ...prevStats,
        [attr]: { value: newVal, modifier: newModifierVal },
      };
    });
  };

  const decreaseAttribute = (attr) => {
    setStats((prevStats) => {
      const newVal = prevStats[attr].value - 1;
      const newModifierVal = calculateLinkedValue(newVal);

      return {
        ...prevStats,
        [attr]: { value: newVal, modifier: newModifierVal },
      };
    });
  };

  const increaseSkill = (skillName) => {
    setSkills((prevSkills) => ({
      ...prevSkills,
      [skillName.toLowerCase().replace(/\s+/g, "-")]:
        prevSkills[skillName.toLowerCase().replace(/\s+/g, "-")] + 1,
    }));
  };

  const decreaseSkill = (skillName) => {
    setSkills((prevSkills) => {
      const currentValue =
        prevSkills[skillName.toLowerCase().replace(/\s+/g, "-")];
      if (currentValue > 0) {
        return {
          ...prevSkills,
          [skillName.toLowerCase().replace(/\s+/g, "-")]: currentValue - 1,
        };
      } else {
        alert("skill cannot be less than 0");
        return prevSkills;
      }
    });
  };
  const showClassStatsFunc = (className) => {
    setClassAttributes(CLASS_LIST[className]);
    setClassSelected(className);
  };
  useEffect(() => {
    classQualCheck();
    setAvailableSkillsPoint(10 + 4 * stats.intelligence.modifier);
  }, [stats, classQualCheck]);

  return (
    <div className="Character">
      <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
        <h1>Character {val}</h1>
        <h2>Attributes</h2>
        {ATTRIBUTE_LIST.map((attr) => {
          const attrKey = attr.toLowerCase();
          return (
            <p key={attr}>
              <span>{attr}</span>
              <span>Value: {stats[attrKey].value}</span>
              <span>(Modifer: {stats[attrKey].modifier})</span>
              <button onClick={() => increaseAttribute(attrKey)}>+</button>
              <button onClick={() => decreaseAttribute(attrKey)}>-</button>
            </p>
          );
        })}
      </div>
      <div
        style={{ padding: "1rem", border: "1px solid #ccc", margin: "1rem" }}
      >
        {Object.keys(CLASS_LIST).map((className) => {
          return (
            <button
              className={
                qualifiedClass[className] ? "button-qualified" : "button-normal"
              }
              onClick={() => showClassStatsFunc(className)}
              key={className}
            >
              {className}
            </button>
          );
        })}

        {classSelected && (
          <div>
            <p>{classSelected} Minimum Requirements</p>
            {Object.keys(classAttributes).map((attr) => {
              return (
                <div key={attr}>
                  {attr} : {classAttributes[attr]}
                </div>
              );
            })}
            <button onClick={() => setClassSelected(null)}>
              Close Requirements
            </button>
          </div>
        )}
      </div>
      <div
        style={{ padding: "1rem", border: "1px solid #ccc", margin: "1rem" }}
      >
        <h3>Skills list</h3>
        <p>Total available skill points : {availableSkillsPoint}</p>
        {SKILL_LIST.map((skill) => {
          return (
            <div>
              <p>
                {skill.name}:
                {skills[skill.name.toLowerCase().replace(/\s+/g, "-")]}
                (Modifier: {skill.attributeModifier}:{" "}
                {stats[skill.attributeModifier.toLowerCase()].modifier})
                <span>
                  <button onClick={() => increaseSkill(skill.name)}>+</button>
                  <button onClick={() => decreaseSkill(skill.name)}>-</button>
                </span>
                total:{" "}
                {skills[skill.name.toLowerCase().replace(/\s+/g, "-")] +
                  stats[skill.attributeModifier.toLowerCase()].modifier}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Character;
