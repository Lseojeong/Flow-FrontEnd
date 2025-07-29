//CheckBoxPlayground.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckBox } from '@/components/common/checkbox/CheckBox';

export const CheckBoxPlayground: React.FC = () => {
  // Small size states
  const [smallUnchecked, setSmallUnchecked] = useState(false);
  const [smallChecked, setSmallChecked] = useState(true);
  const [smallDisabledUnchecked, setSmallDisabledUnchecked] = useState(false);
  const [smallDisabledChecked, setSmallDisabledChecked] = useState(true);

  // Medium size states
  const [mediumUnchecked, setMediumUnchecked] = useState(false);
  const [mediumChecked, setMediumChecked] = useState(true);
  const [mediumDisabledUnchecked, setMediumDisabledUnchecked] = useState(false);
  const [mediumDisabledChecked, setMediumDisabledChecked] = useState(true);

  // Outline variant states
  const [outlineUnchecked, setOutlineUnchecked] = useState(false);
  const [outlineChecked, setOutlineChecked] = useState(true);
  const [outlineDisabledUnchecked, setOutlineDisabledUnchecked] = useState(false);
  const [outlineDisabledChecked, setOutlineDisabledChecked] = useState(true);

  return (
    <Container>
      <Title>CheckBox Component Playground</Title>

      {/* Small Size Section */}
      <Section>
        <SectionTitle>Small Size (기본값)</SectionTitle>
        <TestGrid>
          <TestCase>
            <Label>Unchecked</Label>
            <CheckBox
              id="small-unchecked"
              label="Small CheckBox"
              checked={smallUnchecked}
              onChange={setSmallUnchecked}
              size="small"
            />
          </TestCase>

          <TestCase>
            <Label>Checked</Label>
            <CheckBox
              id="small-checked"
              label="Small CheckBox"
              checked={smallChecked}
              onChange={setSmallChecked}
              size="small"
            />
          </TestCase>

          <TestCase>
            <Label>Disabled Unchecked</Label>
            <CheckBox
              id="small-disabled-unchecked"
              label="Small CheckBox (Disabled)"
              checked={smallDisabledUnchecked}
              onChange={setSmallDisabledUnchecked}
              size="small"
              disabled
            />
          </TestCase>

          <TestCase>
            <Label>Disabled Checked</Label>
            <CheckBox
              id="small-disabled-checked"
              label="Small CheckBox (Disabled)"
              checked={smallDisabledChecked}
              onChange={setSmallDisabledChecked}
              size="small"
              disabled
            />
          </TestCase>
        </TestGrid>
      </Section>

      {/* Medium Size Section */}
      <Section>
        <SectionTitle>Medium Size</SectionTitle>
        <TestGrid>
          <TestCase>
            <Label>Unchecked</Label>
            <CheckBox
              id="medium-unchecked"
              label="Medium CheckBox"
              checked={mediumUnchecked}
              onChange={setMediumUnchecked}
              size="medium"
            />
          </TestCase>

          <TestCase>
            <Label>Checked</Label>
            <CheckBox
              id="medium-checked"
              label="Medium CheckBox"
              checked={mediumChecked}
              onChange={setMediumChecked}
              size="medium"
            />
          </TestCase>

          <TestCase>
            <Label>Disabled Unchecked</Label>
            <CheckBox
              id="medium-disabled-unchecked"
              label="Medium CheckBox (Disabled)"
              checked={mediumDisabledUnchecked}
              onChange={setMediumDisabledUnchecked}
              size="medium"
              disabled
            />
          </TestCase>

          <TestCase>
            <Label>Disabled Checked</Label>
            <CheckBox
              id="medium-disabled-checked"
              label="Medium CheckBox (Disabled)"
              checked={mediumDisabledChecked}
              onChange={setMediumDisabledChecked}
              size="medium"
              disabled
            />
          </TestCase>
        </TestGrid>
      </Section>

      {/* Outline Variant Section */}
      <Section style={{ backgroundColor: '#333' }}>
        <SectionTitle style={{ color: 'white' }}>Outline Variant (어두운 배경용)</SectionTitle>
        <TestGrid>
          <TestCase style={{ backgroundColor: '#444' }}>
            <Label style={{ color: 'white' }}>Unchecked</Label>
            <CheckBox
              id="outline-unchecked"
              label="Outline CheckBox"
              checked={outlineUnchecked}
              onChange={setOutlineUnchecked}
              size="medium"
              variant="outline"
            />
          </TestCase>

          <TestCase style={{ backgroundColor: '#444' }}>
            <Label style={{ color: 'white' }}>Checked</Label>
            <CheckBox
              id="outline-checked"
              label="Outline CheckBox"
              checked={outlineChecked}
              onChange={setOutlineChecked}
              size="medium"
              variant="outline"
            />
          </TestCase>

          <TestCase style={{ backgroundColor: '#444' }}>
            <Label style={{ color: 'white' }}>Disabled Unchecked</Label>
            <CheckBox
              id="outline-disabled-unchecked"
              label="Outline CheckBox (Disabled)"
              checked={outlineDisabledUnchecked}
              onChange={setOutlineDisabledUnchecked}
              size="medium"
              variant="outline"
              disabled
            />
          </TestCase>

          <TestCase style={{ backgroundColor: '#444' }}>
            <Label style={{ color: 'white' }}>Disabled Checked</Label>
            <CheckBox
              id="outline-disabled-checked"
              label="Outline CheckBox (Disabled)"
              checked={outlineDisabledChecked}
              onChange={setOutlineDisabledChecked}
              size="medium"
              variant="outline"
              disabled
            />
          </TestCase>
        </TestGrid>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const TestCase = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #666;
`;
