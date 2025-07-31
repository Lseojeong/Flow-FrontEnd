import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SideBarPlayground } from '@/playground/SideBarPlayground';
import CategorySearchPlayground from '@/playground/FilterPlayground';
import TablePlayground from '@/playground/TablePlayground';
import ButtonPlayground from '@/playground/ButtonPlayground';
import { VersionPlayground } from '@/playground/VersionPlayground';
import InputPlayground from '@/playground/InputPlayground';
import { PopupPlayground } from '@/playground/PopupPlayground';
import { DepartmentPlayground } from '@/playground/DepartmentPlayground';

const PlaygroundRoutes: React.FC = () => (
  <Routes>
    <Route path="/playground/sidebar" element={<SideBarPlayground />} />
    <Route path="/playground/filter" element={<CategorySearchPlayground />} />
    <Route path="/playground/table" element={<TablePlayground />} />
    <Route path="/playground/button" element={<ButtonPlayground />} />
    <Route path="/playground/version" element={<VersionPlayground />} />
    <Route path="/playground/input" element={<InputPlayground />} />
    <Route path="/playground/popup" element={<PopupPlayground />} />
    <Route path="/playground/department" element={<DepartmentPlayground />} />
  </Routes>
);

export default PlaygroundRoutes;
