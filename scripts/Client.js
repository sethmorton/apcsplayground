const axios = require('axios')
const xml2js = require('xml2js')
const fs = require('fs')
let data = fs.readFileSync('app.json');
let parsedData = JSON.parse(data);
console.log(parsedData)
const getData = async () => {
	const parser = new xml2js.Parser()
	let res = await axios.get('https://bwt.cbp.gov/xml/bwt.xml')
	let parsedData = await parser.parseStringPromise(res.data)
	let borders = [
		{ name: "San Ysidro", port: 69 },
		{ name: "Otay Commerical", port: 60 },
		{ name: "Otay Passenger", port: 61 },
		{ name: "Tecate", port: 73 },
		{ name: "Calexico East", port: 35 },
		{ name: "Calexico West", port: 36 },
		{ name: "Andrade", port: 30 },
	]
	for (const border of borders) {
		let data = parsedData['border_wait_time']['port'][border.port]
		update_time = ''
		if (data['passenger_vehicle_lanes'][0]['standard_lanes'][0]['update_time'][0].length > 1) {
			let str = data['passenger_vehicle_lanes'][0]['standard_lanes'][0]['update_time'][0];
			let strSplit = str.split('')
			let selecStr = strSplit.slice(3, 10).join('')
			let year = new Date().getFullYear()
			let month = new Date().getMonth() + 1
			let day = new Date().getDate()
			update_time = new Date(`${year}-${month}-${day} ${selecStr}`)
		}
		let temp = {
			name: border.name,
			time: new Date().toISOString(),
			last_update :  update_time,
			commercial: {
				standard: {
					update_time: data['commercial_vehicle_lanes'][0]['standard_lanes'][0]['update_time'][0],
					operational_status: data['commercial_vehicle_lanes'][0]['standard_lanes'][0]['operational_status'][0],
					delay_minutes: data['commercial_vehicle_lanes'][0]['standard_lanes'][0]['delay_minutes'][0],
					lanes_open: data['commercial_vehicle_lanes'][0]['standard_lanes'][0]['lanes_open'][0],
				},

			},
			passenger: {
				standard: {
					update_time: data['passenger_vehicle_lanes'][0]['standard_lanes'][0]['update_time'][0],
					operational_status: data['passenger_vehicle_lanes'][0]['standard_lanes'][0]['operational_status'][0],
					delay_minutes: data['passenger_vehicle_lanes'][0]['standard_lanes'][0]['delay_minutes'][0],
					lanes_open: data['passenger_vehicle_lanes'][0]['standard_lanes'][0]['lanes_open'][0],
				},
				sentri: {
					update_time: data['passenger_vehicle_lanes'][0]['NEXUS_SENTRI_lanes'][0]['update_time'][0],
					operational_status: data['passenger_vehicle_lanes'][0]['NEXUS_SENTRI_lanes'][0]['operational_status'][0],
					delay_minutes: data['passenger_vehicle_lanes'][0]['NEXUS_SENTRI_lanes'][0]['delay_minutes'][0],
					lanes_open: data['passenger_vehicle_lanes'][0]['NEXUS_SENTRI_lanes'][0]['lanes_open'][0],

				},
				ready: {
					update_time: data['passenger_vehicle_lanes'][0]['ready_lanes'][0]['update_time'][0],
					operational_status: data['passenger_vehicle_lanes'][0]['ready_lanes'][0]['operational_status'][0],
					delay_minutes: data['passenger_vehicle_lanes'][0]['ready_lanes'][0]['delay_minutes'][0],
					lanes_open: data['passenger_vehicle_lanes'][0]['ready_lanes'][0]['lanes_open'][0],

				}
			},
			pedestrian: {
				standard_lanes: {
					update_time: data['pedestrian_lanes'][0]['standard_lanes'][0]['update_time'][0],
					operational_status: data['pedestrian_lanes'][0]['standard_lanes'][0]['operational_status'][0],
					delay_minutes: data['pedestrian_lanes'][0]['standard_lanes'][0]['delay_minutes'][0],
					lanes_open: data['pedestrian_lanes'][0]['standard_lanes'][0]['lanes_open'][0],
				},
				ready_lanes: {
					update_time: data['pedestrian_lanes'][0]['ready_lanes'][0]['update_time'][0],
					operational_status: data['pedestrian_lanes'][0]['ready_lanes'][0]['operational_status'][0],
					delay_minutes: data['pedestrian_lanes'][0]['ready_lanes'][0]['delay_minutes'][0],
					lanes_open: data['pedestrian_lanes'][0]['ready_lanes'][0]['lanes_open'][0],
				}
			}
		}
		console.log(temp)
	}
	// for (let index = 0; index < parsedData['border_wait_time']['port'].length; index++) {
	// 	const element = parsedData['border_wait_time']['port'][index];
	// 	console.log(index, "THIS IS INDEX")
	// 	console.log(element.port_name)

	// }
	// let sanYsidroData = parsedData['border_wait_time']['port'][69]
	// let otayCommericalData = parsedData['border_wait_time']['port'][60]
	// let otayPassengerData = parsedData['border_wait_time']['port'][61]
	// let tecateData = parsedData['border_wait_time']['port'][73]
	// let calexicoEast = parsedData['border_wait_time']['port'][35]
	// let calexicoWest = parsedData['border_wait_time']['port'][36]
	// let andrade = parsedData['border_wait_time']['port'][30]
	// console.log(sanYsidroData['passenger_vehicle_lanes'][0]['standard_lanes'][0]['update_time'])
	// let sanYsidro = {
	// 	name: "San Ysidro",
	// 	time: new Date().toISOString(),
	// 	passenger: {
	// 		standard: {
	// 			update_time: sanYsidroData['passenger_vehicle_lanes'][0]['standard_lanes'][0]['update_time'][0],
	// 			operational_status: sanYsidroData['passenger_vehicle_lanes'][0]['standard_lanes'][0]['operational_status'][0],
	// 			delay_minutes: sanYsidroData['passenger_vehicle_lanes'][0]['standard_lanes'][0]['delay_minutes'][0],
	// 			lanes_open: sanYsidroData['passenger_vehicle_lanes'][0]['standard_lanes'][0]['lanes_open'][0],
	// 		},
	// 		sentri: {
	// 			update_time: sanYsidroData['passenger_vehicle_lanes'][0]['NEXUS_SENTRI_lanes'][0]['update_time'][0],
	// 			operational_status: sanYsidroData['passenger_vehicle_lanes'][0]['NEXUS_SENTRI_lanes'][0]['operational_status'][0],
	// 			delay_minutes: sanYsidroData['passenger_vehicle_lanes'][0]['NEXUS_SENTRI_lanes'][0]['delay_minutes'][0],
	// 			lanes_open: sanYsidroData['passenger_vehicle_lanes'][0]['NEXUS_SENTRI_lanes'][0]['lanes_open'][0],

	// 		},
	// 		ready: {
	// 			update_time: sanYsidroData['passenger_vehicle_lanes'][0]['ready_lanes'][0]['update_time'][0],
	// 			operational_status: sanYsidroData['passenger_vehicle_lanes'][0]['ready_lanes'][0]['operational_status'][0],
	// 			delay_minutes: sanYsidroData['passenger_vehicle_lanes'][0]['ready_lanes'][0]['delay_minutes'][0],
	// 			lanes_open: sanYsidroData['passenger_vehicle_lanes'][0]['ready_lanes'][0]['lanes_open'][0],

	// 		}
	// 	},
	// 	pedestrian: {
	// 		standard_lanes: {
	// 			update_time: sanYsidroData['pedestrian_lanes'][0]['standard_lanes'][0]['update_time'][0],
	// 			operational_status: sanYsidroData['pedestrian_lanes'][0]['standard_lanes'][0]['operational_status'][0],
	// 			delay_minutes: sanYsidroData['pedestrian_lanes'][0]['standard_lanes'][0]['delay_minutes'][0],
	// 			lanes_open: sanYsidroData['pedestrian_lanes'][0]['standard_lanes'][0]['lanes_open'][0],
	// 		},
	// 		ready_lanes: {
	// 			update_time: sanYsidroData['pedestrian_lanes'][0]['ready_lanes'][0]['update_time'][0],
	// 			operational_status: sanYsidroData['pedestrian_lanes'][0]['ready_lanes'][0]['operational_status'][0],
	// 			delay_minutes: sanYsidroData['pedestrian_lanes'][0]['ready_lanes'][0]['delay_minutes'][0],
	// 			lanes_open: sanYsidroData['pedestrian_lanes'][0]['ready_lanes'][0]['lanes_open'][0],
	// 		}
	// 	}
	// }
	// console.log(sanYsidro)
}
getData()