import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SideBarPlayground } from '@/playground/SideBarPlayground';
import CategorySearchPlayground from '@/playground/FilterPlayground';
import TablePlayground from '@/playground/TablePlayground';
import ButtonPlayground from '@/playground/ButtonPlayground';

const PlaygroundRoutes: React.FC = () => (
  <Routes>
    <Route path="/playground/sidebar" element={<SideBarPlayground />} />
    <Route path="/playground/filter" element={<CategorySearchPlayground />} />
    <Route path="/playground/table" element={<TablePlayground />} />
    <Route path="/playground/button" element={<ButtonPlayground />} />
  </Routes>
);

export default PlaygroundRoutes;
