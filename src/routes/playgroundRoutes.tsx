import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SideBarPlayground } from '@/playground/SideBarPlayground';
import CategorySearchPlayground from '@/playground/FilterPlayground';
import TablePlayground from '@/playground/TablePlayground';
import ButtonPlayground from '@/playground/ButtonPlayground';
<<<<<<< HEAD
import { VersionPlayground } from '@/playground/VersionPlayground';
import InputPlayground from '@/playground/InputPlayground';
=======
import InputPlayground from '@/playground/InputPlayground';
import { CheckBoxPlayground } from '@/playground/CheckBoxPlayground'; 
>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)

const PlaygroundRoutes: React.FC = () => (
  <Routes>
    <Route path="/playground/sidebar" element={<SideBarPlayground />} />
    <Route path="/playground/filter" element={<CategorySearchPlayground />} />
    <Route path="/playground/table" element={<TablePlayground />} />
    <Route path="/playground/button" element={<ButtonPlayground />} />
<<<<<<< HEAD
    <Route path="/playground/version" element={<VersionPlayground />} />
    <Route path="/playground/input" element={<InputPlayground />} />
=======
    <Route path="/playground/input" element={<InputPlayground />} />
    <Route path="/playground/checkbox" element={<CheckBoxPlayground />} /> 
>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)
  </Routes>
);

export default PlaygroundRoutes;
