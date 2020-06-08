import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './pages/Home'
import Register from './pages/Register'
import Items from './pages/Items'

const Router = () => {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/items" component={Items} />
        </BrowserRouter>
    )
}

export default Router