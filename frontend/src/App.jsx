import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Wifi, Users, Package, Wallet,
  Settings, Router, ShieldCheck, Search, Bell,
  Menu, ArrowUpRight, ArrowDownRight, Globe,
  Activity, Plus, ChevronRight, Zap, CircleHelp
} from 'lucide-react'
import './style.css'

const menu = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Marketplace', icon: Wifi },
  { name: 'Providers', icon: Router },
  { name: 'Customers', icon: Users },
  { name: 'Packages', icon: Package },
  { name: 'Transactions', icon: Wallet },
  { name: 'Network', icon: Activity },
  { name: 'Settings', icon: Settings }
]

const networks = [
  { name: 'LONGX Community WiFi', location: 'Dar es Salaam', speed: '20 Mbps', price: 'TZS 1,000', status: 'Available' },
  { name: 'Community Hotspot', location: 'Moshi, Tanzania', speed: '10 Mbps', price: 'TZS 500', status: 'Available' },
  { name: 'Business WiFi Zone', location: 'Arusha, Tanzania', speed: '50 Mbps', price: 'TZS 2,000', status: 'Available' },
  { name: 'Village Internet', location: 'Kagera, Tanzania', speed: '15 Mbps', price: 'TZS 1,000', status: 'Available' }
]

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [packages, setPackages] = useState([])
  const [apiStatus, setApiStatus] = useState('Connecting...')

  useEffect(() => {
    let active = true

    async function loadPackages() {
      try {
        const response = await fetch('http://localhost:5000/api/packages')
        if (!response.ok) throw new Error('API request failed')

        const data = await response.json()

        if (active) {
          setPackages(data)
          setApiStatus('Connected')
        }
      } catch (error) {
        if (active) setApiStatus('Disconnected')
        console.error('LONGX API error:', error)
      }
    }

    loadPackages()
    return () => { active = false }
  }, [])

  const filtered = packages
    .map(pkg => ({
      name: pkg.name,
      location: 'Provider location not set',
      speed: `${pkg.duration_hours} hours`,
      price: `TZS ${Number(pkg.price).toLocaleString()}`,
      status: pkg.status
    }))
    .filter(n =>
      (n.name + n.location).toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="app">
      <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Wifi size={24}/></div>
          <div><strong>LONGX</strong><small>WIFI MARKETPLACE</small></div>
        </div>

        <div className="workspace">
          <span className="workspace-dot"/>
          Enterprise Workspace
          <ChevronRight size={15}/>
        </div>

        <div className="nav-label">MAIN MENU</div>
        <nav>
          {menu.map(item => {
            const Icon = item.icon
            return (
              <button key={item.name}
                className={`nav-item ${page === item.name ? 'active' : ''}`}
                onClick={() => { setPage(item.name); setMobileMenu(false) }}>
                <Icon size={19}/>
                <span>{item.name}</span>
                {item.name === 'Network' && <span className="nav-live"/>}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <CircleHelp size={20}/>
            <strong>Need assistance?</strong>
            <p>LONGX support center</p>
            <button onClick={() => setPage('Support')}>Get support <ArrowUpRight size={14}/></button>
          </div>
          <div className="profile">
            <div className="avatar">LX</div>
            <div><strong>LONGX Admin</strong><small>Platform Owner</small></div>
            <Settings size={17}/>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}><Menu/></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div>
          <div className="top-actions">
            <div className="searchbox"><Search size={17}/><input placeholder="Search anything..." value={search} onChange={e => setSearch(e.target.value)}/></div>
            <button className="icon-btn"><Bell size={19}/><i/></button>
            <div className="avatar">LX</div>
          </div>
        </header>

        <div className="content">
          <div className="welcome">
            <div>
              <div className="eyebrow"><span/> ENTERPRISE CONTROL CENTER</div>
              <h1>{page === 'Dashboard' ? 'Welcome to LONGX' : page}</h1>
              <p>Manage your Wi-Fi marketplace and connected services.</p>
            </div>
            <button className="primary-btn" onClick={() => setPage('Marketplace')}><Plus size={18}/> Explore marketplace</button>
          </div>

          <div className="stats">
            {[
              ['Total customers','1,284','+12.8%',Users],
              ['Active providers','24','+8.2%',Router],
              ['Marketplace packages','48','+14.5%',Package],
              ['Platform revenue','TZS 2.4M','+18.6%',Wallet]
            ].map(([label,value,change,Icon]) => (
              <div className="stat-card" key={label}>
                <div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon size={19}/></div></div>
                <h2>{value}</h2>
                <div className="stat-change"><ArrowUpRight size={15}/>{change} <span>this month</span></div>
              </div>
            ))}
          </div>

          <div className="section-grid">
            <section className="panel revenue">
              <div className="panel-heading">
                <div><h3>Marketplace overview</h3><p>Platform activity and network performance</p></div>
                <select><option>Last 7 days</option><option>Last 30 days</option></select>
              </div>
              <div className="chart">
                <div className="chart-lines"><span>TZS 3M</span><span>TZS 2M</span><span>TZS 1M</span><span>TZS 0</span></div>
                <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                  <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4f8cff" stopOpacity=".28"/><stop offset="100%" stopColor="#4f8cff" stopOpacity="0"/></linearGradient></defs>
                  <path d="M0 145 C50 130 60 100 110 115 S180 140 220 85 S300 115 350 65 S420 100 470 45 S550 60 600 15 L600 180 L0 180 Z" fill="url(#area)"/>
                  <path d="M0 145 C50 130 60 100 110 115 S180 140 220 85 S300 115 350 65 S420 100 470 45 S550 60 600 15" fill="none" stroke="#4f8cff" strokeWidth="3"/>
                </svg>
              </div>
              <div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
            </section>

            <section className="panel network-panel">
              <div className="panel-heading"><div><h3>Network status</h3><p>Service health overview</p></div><span className={apiStatus === 'Connected' ? 'healthy' : 'pending'}>
                  {apiStatus}
                </span></div>
              <div className="network-visual"><div className="pulse"><Wifi size={30}/></div><div className="pulse-ring"/></div>
              <div className="network-info"><span>Connected infrastructure</span><strong>24 <small>providers</small></strong></div>
              <div className="health-row"><span>Platform uptime</span><strong>99.9%</strong></div>
              <div className="health-row"><span>Router integration</span><strong className="pending">Not configured</strong></div>
            </section>
          </div>

          <section className="panel marketplace">
            <div className="panel-heading">
              <div><h3>Wi-Fi marketplace</h3><p>Discover internet packages across the network</p></div>
              <button className="text-btn" onClick={() => setPage('Marketplace')}>View all <ArrowUpRight size={15}/></button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>NETWORK / PROVIDER</th><th>LOCATION</th><th>SPEED</th><th>PRICE</th><th>STATUS</th><th></th></tr></thead>
                <tbody>
                  {filtered.map((n,i) => <tr key={n.name}>
                    <td><div className="network-name"><div className="mini-wifi"><Wifi size={17}/></div><strong>{n.name}</strong></div></td>
                    <td>{n.location}</td><td>{n.speed}</td><td><strong>{n.price}</strong></td>
                    <td><span className="available">{n.status}</span></td>
                    <td><button className="row-btn" onClick={() => alert('Demo package. Provider and payment setup required.')}>Details <ChevronRight size={15}/></button></td>
                  </tr>)}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="empty">No networks found.</p>}
            </div>
          </section>

          <footer><span>© 2026 LONGX WIFI MARKETPLACE</span><span><span className="footer-dot"/> Enterprise platform · Development mode</span></footer>
        </div>
      </main>
    </div>
  )
}
