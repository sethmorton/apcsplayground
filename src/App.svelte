<script>
	import { onMount } from "svelte";
	let client_id = `zUbAzaFeqFBEwzRA0EUHqiogAcwqhEyG`;
	let client_secret = `vLKAgE0CSpC4Q3jD`;
	let airportCode = ``;
	let errorLog = ``;
	let selectedYear = "2017";
	let selectedMonth = 1;
	$: {
		if (selectedMonth < 1 || selectedMonth > 12) {
			errorLog = `Please enter a valid month`;
		} else errorLog = ``;
		if (!/^(201[6-8])$/.test(selectedYear)) {
			errorLog = `Please input a valid year`;
		} else errorLog = ``;
	}
	$: monthSpliced = ("0" + selectedMonth).slice(-2);
	let destinations = [];
	onMount(async () => {
		topDestinations("MAD", "2017", "01");
	});
	const getToken = async () => {
		let req = await fetch(
			"https://test.api.amadeus.com/v1/security/oauth2/token",
			{
				method: "POST",
				headers: {
					Accept: "application/text",
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
			}
		);
		let res = await req.json();
		let token = res["access_token"];
		return token;
	};
	const topDestinations = async (origin, year, month) => {
		console.log(year, month);
		let uri = `https://test.api.amadeus.com/v1/travel/analytics/air-traffic/traveled?
		originCityCode=${origin}
		&period=${year}-${month}
		&max=10&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score`;
		let token = await getToken();
		let req = await fetch(uri, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		let res = await req.json();
		console.log(res);
		let data = res.data;
		if (res["errors"]) {
			errorLog = `Please enter a valid airport code`;
		} else {
			destinations = data;
			await data.forEach(x => {
				let nameUri = `https://www.air-port-codes.com/api/v1/single?iata=${x.destination}`
				 fetch (nameUri, {
					method : "POST",
					headers : {
						Accept : "application/json",	
						"APC-Auth" :  "c9d7fbc4df",
						"APC-Auth-Secret" :  "7c659933177a42d",
						"Content-Type": "application/json",
						"Content-Length" : "0"	
					}
				}).then(res => console.log(res.json()))
// 				let uri = `https://pixabay.com/api/?key=21379514-9f0029092add8c57c42093c34&q=PAR+Airport&image_type=photo
// `curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'APC-Auth: b5269ee4ef' 'https://www.air-port-codes.com/api/v1/single?iata=BCN'
// 				await fetch()
				// let temp = {
				// 	name : x.destination,
				// 	image : 
				// }
			})
			errorLog = ``;
			if (destinations.length < 1)
				errorLog = `No data for this time period`;
			console.log(destinations);
		}
	};
</script>

<div class="bgimg w3-display-container ">
	<!-- <div class="w3-display-topleft w3-padding-large w3-xlarge">
	  Dashboard
	</div> -->
	<div class="w3-display-middle">
		<!-- <div class="w3-ul w3-center w3-card-4">
			<li><input type="text" class="w3-input" bind:value={airportCode}></li>
			<li><input type="text" class="w3-input" bind:value={selectedYear}></li>
			<li><input type="text" class="w3-input" bind:value={selectedMonth}></li>
			<!-- <input type="text" bind:value={selectedYear}>
			<input type="text" bind:value={selectedMonth}> 
		</div> -->
		<!-- <div class="w3-card-4">
			<div class="w3-container w3-brown">
				<h2>Input Colors</h2>
			</div>
			<div class="w3-container w3-white">
				<p>
					<label class="w3-text-brown"><b>First Name</b></label>
					<input
						class="w3-input w3-border w3-sand"
						name="first"
						type="text"
					/>
				</p>
				<p>
					<label class="w3-text-brown"><b>Last Name</b></label>
					<input
						class="w3-input w3-border w3-sand"
						name="last"
						type="text"
					/>
				</p>
				<p>
					<button class="w3-btn w3-brown">Register</button>
				</p>
			</div>
		</div>
		<button
			on:click={topDestinations(airportCode, selectedYear, monthSpliced)}
			>Submit</button
		>
		<h4 class="w3-text-red">{errorLog}</h4> -->
		<h1 class="w3-jumbo w3-animate-top w3-text-white">Top Destinations</h1>
		<hr class="w3-border-grey" style="margin:auto;width:40%" />
		<div class="w3-container">
			<p>
				<label class="w3-text-white"><b>Airport Code</b></label>
				<input class="w3-input w3-border w3-turqoise" type="text" />
			</p>
			<p />
			<p>
				<label class="w3-text-white"><b>Year</b></label>
				<input class="w3-input w3-border w3-turqoise" type="number" />
			</p>
			<p />
			<p>
				<label class="w3-text-white"><b>Month</b></label>
				<input class="w3-input w3-border w3-turqoise" type="number" />
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

		<div class="w3-quarter">
			<img
				src="img_avatar.jpg"
				alt="Boss"
				style="width:45%"
				class="w3-circle w3-hover-opacity"
			/>
			<h3>Johnny Walker</h3>
			<p>Web Designer</p>
		</div>

		<div class="w3-quarter">
			<img
				src="img_avatar.jpg"
				alt="Boss"
				style="width:45%"
				class="w3-circle w3-hover-opacity"
			/>
			<h3>Rebecca Flex</h3>
			<p>Support</p>
		</div>

		<div class="w3-quarter">
			<img
				src="img_avatar.jpg"
				alt="Boss"
				style="width:45%"
				class="w3-circle w3-hover-opacity"
			/>
			<h3>Jan Ringo</h3>
			<p>Boss man</p>
		</div>

		<div class="w3-quarter">
			<img
				src="img_avatar.jpg"
				alt="Boss"
				style="width:45%"
				class="w3-circle w3-hover-opacity"
			/>
			<h3>Kai Ringo</h3>
			<p>Fixer</p>
		</div>
	</div>
</div>
{#each destinations as airport}
	<h1>{airport.destination}</h1>
{/each}

<!-- <script ✂prettier:content✂="CglpbXBvcnQge29uTW91bnR9IGZyb20gJ3N2ZWx0ZScKCWxldCBsYW5ndWFnZSA9ICdmcmVuY2gnCgljb25zdCBhdWRpb091dHB1dCA9IGFzeW5jIChsYW5ndWFnZSwgY29sb3IpID0+IHsKCQlsZXQgZmlsZVBhdGggPSBgJHtsYW5ndWFnZX0vJHtjb2xvcn0ubXAzYAoJCWxldCBhdWRpbyA9IG5ldyBBdWRpbyhmaWxlUGF0aCk7CgkJYXVkaW8ucGxheSgpOwoJfQo=">{}</script>	
<button on:click={() => language = 'french'}>French</button>
<button on:click={() => language = 'spanish'}>Spanish</button>
<br>
<br>
<button on:click={audioOutput(language, 'red')}>Red</button>
<button on:click={audioOutput(language, 'blue')}>Blue</button>
<button on:click={audioOutput(language, 'orange')}>Orange</button>
<button on:click={audioOutput(language, 'brown')}>Brown</button>
<button on:click={audioOutput(language, 'violet')}>Violet</button>
<button on:click={audioOutput(language, 'green')}>Green</button>
<button on:click={audioOutput(language, 'purple')}>Purple</button>
<button on:click={audioOutput(language, 'yellow')}>Yellow</button> -->
<style>
	.bgimg {
		background-image: url("https://wallpaperaccess.com/full/254361.jpg");
		min-height: 600px;
		max-height: 900px;
		width: 100%;
		background-position: center;
		background-size: cover;
	}
</style>
