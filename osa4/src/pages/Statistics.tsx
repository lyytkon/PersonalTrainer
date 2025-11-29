import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

type ActivityStats = {
    activity: string;
    duration: number;
};

function Statistics() {
    const [stats, setStats] = useState<ActivityStats[]>([]);

    const getTrainingStats = async () => {
        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings');
            const data = await response.json();
            const trainings = data._embedded.trainings;

            const grouped = _.groupBy(trainings, 'activity');
            const statsData = _.map(grouped, (group, activity) => ({
                activity: activity,
                duration: _.sumBy(group, 'duration')
            }));

            setStats(statsData);
        } catch (err) {
            console.error('Virhe haettaessa harjoitustilastoja:', err);
        }
    };

    useEffect(() => {
        getTrainingStats();
    }, []);

    return (
        <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}>
            <h2>Harjoitustilastot (Minuuttia aktiviteeteittain)</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity" />
                    <YAxis label={{ value: 'Minuuttia', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="duration" fill="#8884d8" name="Kesto (min)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Statistics;
