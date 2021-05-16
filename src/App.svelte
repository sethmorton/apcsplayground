<script>
	import { onMount } from "svelte";
	// ************************ GLOBAL VARS (Normally would want to import .env file)************************ 
	let client_id = `zUbAzaFeqFBEwzRA0EUHqiogAcwqhEyG`;
	let client_secret = `vLKAgE0CSpC4Q3jD`;
	let pixabayId = `21379514-9f0029092add8c57c42093c34`;
	let airportCode = ``;
	let errorLog = ``;
	let selectedYear = "";
	let selectedMonth = "";
	let airportJSON = [];
	let destinations = [];
	// ************************ REACTIVITY SECTION  ************************ 
	$: outputArr = [];
	$: {
		if (Number(selectedMonth) < 1 || Number(selectedMonth) > 12) {
			errorLog = `Please enter a valid month`;
		}
		else if (!/^(201[6-8])$/.test(selectedYear)) {
			errorLog = `Please input a valid year`;
		} 
		else {
			errorLog = ``
		}
	}
	$: monthSpliced = ("0" + selectedMonth).slice(-2);
	// ************************ GET AIRPORT CODES  ************************
	onMount(async () => airportJSON = await getAirportCodes());
	const getAirportCodes = async () => {
		let req = await fetch(
			"https://raw.githubusercontent.com/ram-nadella/airport-codes/master/airports.json"
		);
		let res = await req.json();
		return res;
	};
	// ************************ GET AMADEUS TOKEN ************************
	const getToken = async (uri, tokenLength) => {
		if (uri != typeof '') {
			errorLog = `Token Validation Error`
		}
		let res = ``
		// Length Token (MS)
		if (tokenLength <= 10000) {
			let data = await fetch(
			uri,
			{
				method: "POST",
				headers: {
					Accept: "application/text",
					"Content-Type": "application/x-www-form-urlencoded",
					"token_length" : tokenLength

				},
				body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
			}
		);
		res = data.json()
		}
		else  {
			let data = await fetch(
			uri,
			{
				method: "POST",
				headers: {
					Accept: "application/text",
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
			}
		);
		res = data.json()
		}
		let token = res["access_token"];
		return token;
	};
	// ************************ TOP DESTINATIONS FUNC ************************
	const topDestinations = async (origin, year, month) => {
		let uri = `https://test.api.amadeus.com/v1/travel/analytics/air-traffic/traveled?
		originCityCode=${origin}
		&period=${year}-${month}
		&max=10&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score`;
		let token = await getToken('https://test.api.amadeus.com/v1/security/oauth2/token', 150000);
		let req = await fetch(uri, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		let res = await req.json();
		let data = res.data;
		if (res["errors"]) {
			errorLog = `Please enter a valid airport code`;
		} else {
			destinations = data;
			getImages(destinations);
			errorLog = ``;
			if (destinations.length < 1)
			errorLog = `No data for this time period`;
		}
	};
	// ************************ GET IMAGES FROM DESTINATIONS ************************
	const getImages = async (destinations) => {
		outputArr = []
		for (const x of destinations) {
			let url =
				"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png";
			let airportName = airportJSON[x.destination];
			let cityName = x.destination
			if (airportName != undefined) {
				let req = await fetch(
					`https://pixabay.com/api/?key=${pixabayId}&q=${airportName.city}&image_type=photo`
				);
				cityName = airportName.city;
				let res = await req.json();
				url = res.hits[0].largeImageURL;
			}
			outputArr = [...outputArr, { name: cityName, image: url }];
		}
	};
</script>

<div class="bgimg w3-display-container ">
	<div class="w3-display-middle">
		<h1 class="w3-jumbo w3-animate-top w3-text-white">Top Destinations</h1>
		<hr class="w3-border-grey" style="margin:auto;width:40%" />
		<div class="w3-container">
			<p>
				<label class="w3-text-white"><b>Airport Code</b></label>
				<input
					class="w3-input w3-border w3-turqoise"
					bind:value={airportCode}
					placeholder="SFO"
					type="text"
				/>
			</p>
			<p />
			<p>
				<label class="w3-text-white"><b>Year</b></label>
				<input
					class="w3-input w3-border w3-turqoise"
					bind:value={selectedYear}
					placeholder="2017"
					type="number"
				/>
			</p>
			<p />
			<p>
				<label class="w3-text-white"><b>Month</b></label>
				<input
					class="w3-input w3-border w3-turqoise"
					bind:value={selectedMonth}
					placeholder="1"
					type="number"
				/>
			</p>
			<h4 class="w3-text-yellow">{errorLog}</h4>
			<button
				class="w3-btn w3-deep-purple"
				on:click={topDestinations(
					airportCode,
					selectedYear,
					monthSpliced
				)}>Submit</button
			>
		</div>
	</div>
</div>
<div class="w3-container w3-padding-64 w3-center">
	<h2>Top Destinations:</h2>
	<div class="w3-row">
		<br />
		{#each outputArr as destination, i}
			<div class="w3-quarter">
				<img
					src={destination.image}
					alt={destination.name}
					style="width:105px; height: 98px;"
					class="w3-circle w3-hover-opacity"
				/>
				<h3>#{i + 1} : {destination.name}</h3>
			</div>
		{/each}
	</div>
	<button on:click={() => getToken('https://test.api.amadeus.com/v1/security/oauth2/token', 5000)}>
		Get New Token
	</button>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=GFS+Didot&display=swap');
	.bgimg, .w3-jumbo {
		font-family: 'GFS Didot', serif !important;
	}
	.bgimg {
		background-image: url("https://wallpaperaccess.com/full/254361.jpg");
		min-height: 600px;
		max-height: 900px;
		width: 100%;
		background-position: center;
		background-size: cover;
	}
</style>
