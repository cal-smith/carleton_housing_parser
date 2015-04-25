require 'nokogiri'
require 'open-uri'
require 'sqlite3'

db = SQLite3::Database.new( "housing.db" )
db.execute("CREATE TABLE IF NOT EXISTS housing ( 
	id VARCHAR(255),
	zone TEXT,
	price NUMERIC,
	furnished TEXT,
	type TEXT,
	rawhtml TEXT
);")

#loop untill we 404
for n in 88..88 #currently there is a total of 88 pages of listings
	page = Nokogiri::HTML(open("http://housing.carleton.ca/off-campus-housing/page/#{n}/"))
	page.css('.posting').each do |link|
		unless link.css('p')[3].nil?
			id = link.css('p')[3].text.match(/[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/)
			rawhtml = link
			price = link.css('p')[2].text.match(/\$[1-9](?:\d{0,4})(?:,\d{3})*(?:\.\d{3})*|\$\d+/)
			price = price.to_s
			price[0] = ""
			if price =~ /,/
				price = price.gsub(/,/, "")
			end
			furnished = false
			for n in 1..4
				link.css('p')[1].css('a').each do |href|
					if href['href'] =~ /\/furnished\//
						furnished = true
					end
				end
			end
			zone = "other"
			for i in 0..1
				case link.css('a')[i].text
				when "Algonquin"
					zone = "algonquin"
				when "Alta Vista"
					zone = "alta-vista"
				when "Aylmer"
					zone = "aylmer"
				when "Barrhaven"
					zone = "barrhaven"
				when "Bell’s Corner"
					zone = "bells-corner"
				when "Billing’s Bridge"
					zone = "billings-bridge"
				when "Britannia"
					zone = "britannia"
				when "Byward Market"
					zone = "byward-market"
				when "Carlingwood"
					zone = "carlingwood"
				when "Central West"
					zone = "central-west"
				when "Centretown"
					zone = "centretown"
				when "China Town"
					zone = "china-town"
				when "Civic"
					zone = "civic"
				when "Dow's Lake"
					zone = "dows-lake"
				when "Downtown"
					zone = "downtown"
				when "Experimental Farm"
					zone = "experimental-farm"
				when "Gatineau/Hull"
					zone = "gatineau-hull"
				when "Glebe"
					zone = "glebe"
				when "Gloucester"
					zone = "gloucester"
				when "Herongate"
					zone = "herongate"
				when "Hog’s Back"
					zone = "hogs-back"
				when "Hull"
					zone = "hull"
				when "Hunt Club"
					zone = "hunt-club"
				when "Kanata"
					zone = "kanata"
				when "Little Italy"
					zone = "little-italy"
				when "Lowertown"
					zone = "lowertown"
				when "Main"
					zone = "main"
				when "Mooney’s Bay"
					zone = "mooneys-bay"
				when "Navan"
					zone = "navan"
				when "Nepean"
					zone = "nepean"
				when "Nepean South"
					zone = "nepean-south"
				when "Old Ottawa East"
					zone = "old-ottawa-east"
				when "Old Ottawa South"
					zone = "old-ottawa-south"
				when "Orleans"
					zone = "orleans"
				when "Ottawa East"
					zone = "ottawa-east"
				when "Ottawa South"
					zone = "ottawa-south"
				when "Ottawa West"
					zone = "ottawa-west"
				when "Parkwood Hills"
					zone = "parkwood-hills"
				when "Pinecrest"
					zone = "pinecrest"
				when "Rockcliffe"
					zone = "rockcliffe"
				when "Sandy Hill"
					zone = "sandy-hill"
				when "South Keys"
					zone = "south-keys"
				when "Vanier"
					zone = "vanier"
				when "Westboro"
					zone = "westboro"
				when "Other"
					zone = "other"
				else
					zone = "other"
				end
			end
			type = "any"
			case link.css('a')[0].text
			when "Apartments"
				type = "apartments"
			when "Rooms"
				type = "rooms"
			when "Shared Apartments"
				type = "shared-apartments"
			when "Shared Townhouses / Houses"
				type = "shared-townhouses-houses"
			when "Townhouses / Houses"
				type = "townhouses-houses"
			else
				type = "other"
			end
			puts id
			puts price
			puts furnished
			puts zone
			puts type
			puts "inserting into DB"
			sql = "INSERT INTO housing (id, price, furnished, zone, type, rawhtml) VALUES (:id, :price, :furnished, :zone, :type, :rawhtml)"
			db.execute(sql, :id => id.to_s, :price => price.to_s, :furnished => furnished.to_s, :zone => zone, :type => type, :rawhtml => rawhtml.to_s)
		end
	end
end
