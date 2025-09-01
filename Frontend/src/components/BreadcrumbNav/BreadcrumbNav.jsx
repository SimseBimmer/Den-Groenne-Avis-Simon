import React from 'react';
import './BreadcrumbNav.scss';
import { useNavigate } from 'react-router-dom';

export default function BreadcrumbNav({ path, links }) {
    const navigate = useNavigate();

    return (
        <nav id="breadcrumbNav" aria-label="Brødkrummesti">
            Du er her: {path.map((item, idx) => {
                const isLast = idx === path.length - 1;
                const link = links && links[idx];
                return (
                    <span
                        key={idx}
                        className={!isLast && link ? 'breadcrumb-link' : ''}
                        onClick={() => {
                            if (!isLast && link) navigate(link);
                        }}
                        aria-current={isLast ? 'page' : undefined}
                    >
                        {item}
                        {idx < path.length - 1 && ' / '}
                    </span>
                );
            })}
        </nav>
    );
}