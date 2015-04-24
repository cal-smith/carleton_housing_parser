require 'sinatra'
require 'sqlite3'
require 'json'

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
		sqlopts << " zone in (#{params[:zone].split('&').collect{'?'}.join(',')}) "
		array << params[:zone].split('&')
	end

	unless params[:type] == "all"
		sqlopts << " type in (#{params[:type].split('&').collect{'?'}.join(',')}) "
		array << params[:type].split('&')
	end

	unless params[:furnished] == "all"
		sqlopts << "furnished = ?"
		array << [params[:furnished]]
	end

	if params[:price] == "all"
		array << [5000]
	else 
		array << [params[:price]]
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