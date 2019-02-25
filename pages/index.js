import fetch from 'isomorphic-unfetch'
import Head from 'next/head'

export default class IndexPage extends React.Component {

	static async getInitialProps ({req, res, query}) {
		try {
			const protocol = req.headers['x-forwarded-proto'] || 'http';
			const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
			const url = `${baseUrl}/api/config`;
			const response = await fetch(url);
			const configsJson = await response.json();
			return { apiUrl: url, configs: configsJson };
		}
		catch (err) {
			return { error: 'Could not load configs' }
		}
	};

	constructor (props) {
		super(props)
		this.state = { apiKey: '', configs: props.configs }
	}

	componentDidMount() {
		
	}

	handleChange (event) {
		this.setState({ apiKey: event.target.value });
	}

	handleAdd (event) {
		const newconfig = {
			apiKey: this.state.apiKey,
		};
		const updateLocalconfigstate = function (results) {
			console.log('POST', results);
			this.setState({ apiKey: '', configs: this.state.configs.concat(newconfig) });
		};
		// POST on API
		fetch(this.props.apiUrl, {
			method: 'POST',
			body: JSON.stringify(newconfig),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then(updateLocalconfigstate.bind(this))
		.catch(err => console.error('POST error', err));			
	}

	handleDelete (index, configId, event) {
		const updateLocalconfigstate = function (results) {
			console.log('DELETE', results);
			this.setState({ configs: this.state.configs.filter(function (config) { return config._id !== configId }) });
		};
		// DELETE on API
		fetch(this.props.apiUrl + '/' + configId, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then(updateLocalconfigstate.bind(this))
		.catch(err => console.error('DELETE error', err));
	}

	handleEdit (index, configId, event) {
		var apiKey = prompt("Please enter your text", "");
		const newconfig = {
			apiKey: apiKey,
		};
		const updateLocalconfigstate = function (results) {
			console.log('PUT', results);
			this.setState({ apiKey: '', configs: this.state.configs.concat(newconfig) });
		};
		// PUT on API
		fetch(this.props.apiUrl + '/' + configId, {
			method: 'PUT',
			body: JSON.stringify(newconfig),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then(updateLocalconfigstate.bind(this))
		.catch(err => console.error('UPDATE error', err));
	}

	

	render () {

		return <div style={ { textAlign: 'center' } }>
			<Head>
				<title>rajawalicinema</title>
				<meta name="description" content="Demo of nextjs-express-mongoose-crudify-boilerplate"/>
				<meta charSet="utf-8"/>
				<meta name="viewport" content="initial-scale=1.0, width=device-width"/>
				<link rel="stylesheet" href="/static/app.css"/>
			</Head>
			<div>
			<h1>CRUD Example</h1>
			<h2>Enter your text</h2>
			<input value={this.state.apiKey} onChange={this.handleChange.bind(this)} placeholder='Enter a config apiKey'/>
			<button onClick={this.handleAdd.bind(this)}>Add Api Key</button>
			<p>Result here : </p>
			{
				this.state.configs ? this.state.configs.map((config, index) =>
				<div key={index}>
					{config.apiKey} 
					<a
					  style={ { color: 'orange' } }
					  onClick={this.handleEdit.bind(this, index, config._id)}>EDIT
					</a>
					<a
					  style={ { color: 'red' } }
					  onClick={this.handleDelete.bind(this, index, config._id)}>DELETE
					</a>
					<style jsx>{`
						a {
							cursor: pointer;
							margin-left: 8px;
						}
					`}</style>
				</div>
			) : []
			}
			</div>
			
		</div>
	};

}