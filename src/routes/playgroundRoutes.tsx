import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SideBarPlayground } from '@/playground/SideBarPlayground';
import CategorySearchPlayground from '@/playground/FilterPlayground';
import TablePlayground from '@/playground/TablePlayground';

const PlaygroundRoutes: React.FC = () => (
  <Routes>
    <Route path="/playground/sidebar" element={<SideBarPlayground />} />
    <Route path="/playground/filter" element={<CategorySearchPlayground />} />
    <Route path="/playground/table" element={<TablePlayground />} />
  </Routes>
);

export default PlaygroundRoutes;
