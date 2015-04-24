require 'sinatra'
require 'sqlite3'

db = SQLite3::Database.new("housing.db")

get '/?' do
	listing = db.execute("SELECT * FROM housing LIMIT 0, 100")
	erb :index, :locals => {:listing => listing}
end

# zone is city zone
# price is upper price limit
# furished is a simple true, false, or undefined option
# type is the type of housing
get '/limit/:zone/?:price?/?:furnished?/?:type?/?' do
	sql = "select * from housing where "
	sqlopts = []
	array = []
	unless params[:zone] == "all"
		puts "no zone"
		sqlopts << " zone in (#{params[:zone].split('&').collect{'?'}.join(',')}) "
		array << params[:zone].split('&')
	end

	unless params[:type] == "all"
		puts "no type"
		sqlopts << " type in (#{params[:type].split('&').collect{'?'}.join(',')}) "
		array << params[:type].split('&')
	end

	unless params[:furnished] == "all"
		puts "no furns"
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
	puts sql
	puts sqlopts
	puts array
	listing = db.execute(sql, array)
	erb :index, :locals => {:listing => listing} 
end