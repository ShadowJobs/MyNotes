import React from "react";
import styled, { keyframes, css } from "styled-components";
import { DashboardApps } from "@/config/navigation";

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 5px;
`;

const Welcome = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 40px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 1199px) and (min-width: 769px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) and (min-width: 481px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const blinkAnimation = keyframes`
  50% {
    opacity: 0.7;
  }
`;

const FeatureCard = styled.div<{ recommend?: boolean }>`
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  border: 1px solid #eee;
  min-width: 250px;
  position: relative;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  ${props => props.recommend && css`
    &::after {
      content: "荐!";
      position: absolute;
      top: -1px;
      left: 0px;
      color: red;
      border: 1px solid red;
      border-radius: 5px;
      padding: 0px;
      width: 25px;
      height:19px;
      text-align: center;
      animation: ${blinkAnimation} 3s linear infinite;
      font-size: 12px;
    }

  `}
`;

const FeatureHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const FeatureTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  
  .anticon {
    font-size: 20px;
    color: #1677ff;
  }
`;

const MoreLink = styled.a`
  color: #1677ff;
  font-size: 14px;
  display: inline-block;
  white-space: nowrap;
`;

const ExamplesList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const ExampleItem = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
`;

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Welcome>
        欢迎使用我的大模型应用
      </Welcome>
      <FeaturesGrid>
        {DashboardApps.map((feature: any, index: number) => (
          <FeatureCard key={index} onClick={() => window.open(feature.url, "_blank")} recommend={feature.recommend}>
            <FeatureHeader>
              <FeatureTitle>
                <img src={feature.icon} alt={feature.title} style={{ width: "1.5rem", height: "1.5rem", marginRight: 10 }}
                  onError={(e) => {
                    if (!e.currentTarget.getAttribute('data-tried-loading-default')) {
                      e.currentTarget.setAttribute('data-tried-loading-default', 'true');
                      e.currentTarget.src = '/images/default.svg'
                    }
                  }}
                />
                {feature.cardTitle || feature.name}
              </FeatureTitle>
              <MoreLink href={feature.url} target="_blank" onClick={e => e.preventDefault()}>体验更多 &gt;</MoreLink>
            </FeatureHeader>
            <ExamplesList>
              {feature.description.map((description: string, i: number) => (
                <ExampleItem key={i}>
                  {description}
                </ExampleItem>
              ))}
            </ExamplesList>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </Container>
  );
};

export default Dashboard;