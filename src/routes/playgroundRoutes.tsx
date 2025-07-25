import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SideBarPlayground } from '@/playground/SideBarPlayground';
import CategorySearchPlayground from '@/playground/FilterPlayground';

const PlaygroundRoutes: React.FC = () => (
  <Routes>
    <Route path="/playground/sidebar" element={<SideBarPlayground />} />
    <Route path="/playground/filter" element={<CategorySearchPlayground />} />
  </Routes>
);

export default PlaygroundRoutes;
