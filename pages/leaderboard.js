export default () => {
    return (
        <div class="container">
            <header>
                <center><h1>GLOBAL RANKINGS</h1></center>
            </header>
            <div class="wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Hospital</th>
                            <th>Points</th>
                            <th>+/-</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="rank">1</td>
                            <td class="team">AIIMS</td>
                            <td class="points">1460</td>
                            <td class="up-down">0</td>
                        </tr>
                        <tr>
                            <td class="rank">2</td>
                            <td class="team">CMC</td>
                            <td class="points">1340</td>
                            <td class="up-down">0</td>
                        </tr>
                        <tr>
                            <td class="rank">3</td>
                            <td class="team">Apollo Hospitals</td>
                            <td class="points">1245</td>
                            <td class="up-down">0</td>
                        </tr>
                        <tr>
                            <td class="rank">4</td>
                            <td class="team">Fortis Hospitals</td>
                            <td class="points">1210</td>
                            <td class="up-down">+2</td>
                        </tr>
                        <tr>
                            <td class="rank">5</td>
                            <td class="team">NIMHANS</td>
                            <td class="points">1186</td>
                            <td class="up-down">-1</td>
                        </tr>
                        <tr>
                            <td class="rank">6</td>
                            <td class="team">Tata Memorial Hospital</td>
                            <td class="points">1181</td>
                            <td class="up-down">-1</td>
                        </tr>
                        <tr>
                            <td class="rank">7</td>
                            <td class="team">Sankara Nethralaya</td>
                            <td class="points">1178</td>
                            <td class="up-down">-1</td>
                        </tr>
                        <tr>
                            <td class="rank">8</td>
                            <td class="team">PGIMER</td>
                            <td class="points">1161</td>
                            <td class="up-down">0</td>
                        </tr>
                        <tr>
                            <td class="rank">9</td>
                            <td class="team">Sir Ganga Ram Hospital</td>
                            <td class="points">1115</td>
                            <td class="up-down">0</td>
                        </tr>
                        <tr>
                            <td class="rank">10</td>
                            <td class="team">King Edward Memorial Hospital</td>
                            <td class="points">1082</td>
                            <td class="up-down">0</td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <style jsx>{`
            body {
                font-family: 'Lato', Arial, sans-serif;
            }
            
            .container > header {
                margin: 0 auto;
                padding: 1em;
                text-align: center;
            }
            
            .container > header h1 {
                color: dodgerblue;
              font-weight: 600;
                font-size: 3em;
                margin: 0;
            }
            
            .wrapper {
                line-height: 1.5em;
                margin: 0 auto;
                padding: 2em 0 3em;
                width: 90%;
                max-width: 2000px;
                overflow: hidden;
            }
            
            table {
                border-collapse: collapse;
                width: 100%;
                background: #fff;
            }
            
            th {
                background-color: #326295;
                font-weight: bold;
                color: #fff;
                white-space: nowrap;
            }
            
            td, th {
                padding: 1em 1.5em;
                text-align: left;
            }
            
            tbody th {
                background-color: #2ea879;
            }
            tbody tr:nth-child(2n-1) {
                background-color: #f5f5f5;
                transition: all .125s ease-in-out;
            }
            tbody tr:hover {
                background-color: rgba(75,101,149,.3);
            }
            
            td.rank {
                text-transform: capitalize;
            }
            `}</style>
        </div>
    )
}