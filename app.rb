require 'sinatra'
require 'sqlite3'
require 'json'
require 'uri'

db = SQLite3::Database.new("housing.db")

get '/?' do
	db.results_as_hash = true
	listing = db.execute("SELECT * FROM housing LIMIT 0, 100")
	erb :index, :locals => {:listing => listing}
end

# zone is city zone
# price is upper price limit
# furished is a simple true, false, or undefined option
# type is the type of housing
get '/limit/?.?:format?' do
	sql = "select * from housing where "
	sqlopts = []
	array = []
	unless params[:zone] == "all"
		zones = URI.unescape(params[:zone]).split('&')
		sqlopts << " zone in (#{zones.collect{'?'}.join(',')}) "
		array << zones
	end

	unless params[:type] == "all"
		types = URI.unescape(params[:type]).split('&')
		sqlopts << " type in (#{types.collect{'?'}.join(',')}) "
		array << types
	end

	unless params[:furnished] == "all"
		sqlopts << "furnished = ?"
		array << [URI.unescape(params[:furnished])]
	end

	if params[:price] == "all"
		array << [5000]
	else 
		array << [URI.unescape(params[:price])]
	end

	unless sqlopts.length == 0
		sql << sqlopts.join(" and ") << " and "
	end

	sql << " price <= ? order by price asc "
	db.results_as_hash = true
	listing = db.execute(sql, array)
	if params[:format] == "json"
		listing.to_json
	else
		erb :index, :locals => {:listing => listing}
	end
end