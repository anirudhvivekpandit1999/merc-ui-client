import React from "react";
import { Link } from "react-router-dom";


export default function DataCard({ id, title }) {
    return (
        <Link to={`/dashboard/modCard/${id}`} className="card-link" aria-label={`Open ${title}`}>
            <article className="data-card">
                <div className="data-card__header">{title}</div>

                <div className="data-card__body">

                    <p className="hint-card">Click card to open details</p>


                    <div className="card-bottom-squares">
                        <div className="square-panel">
                            <div className="square-content">
                                <div className="mod-label">Approved MOD</div>
                                <div className="mod-value">2.3002</div>
                            </div>
                        </div>


                        <div className="square-panel">
                            <div className="square-content">
                                <div className="mod-label">Current MOD</div>
                                <div className="mod-value">2.3002</div>
                            </div>
                        </div>

                    </div>
                </div>
            </article>
        </Link>
    );
}