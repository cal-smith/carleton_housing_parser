require 'sinatra'
require 'sqlite3'

db = SQLite3::Database.new( "housing.db" )

get '/?' do
	listing = db.execute("SELECT * FROM housing LIMIT 0, 100")
	erb :index, :locals => {:listing => listing}
end

# zone is city zone
# price is upper price limit
# furished is a simple true, false, or undefined option
# type is the type of housing
get '/limit/:zone/?:price?/?:furnished?/?:type?/?' do
	zone = params[:zone].split('&').collect{|x| "'#{x}'"}.join(', ')
	price = params[:price]
	if params[:price].nil? or params[:price] == "all"
		price = 5000
	end
	furnished = params[:furnished]
	type = nil
	if params[:type]
		type = params[:type].split('&').collect{|x| "'#{x}'"}.join(', ')
	end
	sqlopts = []

	if zone != "'all'"
		sqlopts << "zone IN (#{zone})"
	end

	if type !="'all'"
		sqlopts << "type IN (#{type})"
	end

	if furnished != "all"
		sqlopts << "furnished = '#{furnished}'"
	end

	if price
		sqlopts << "price <= #{price} ORDER BY PRICE ASC"
	end
	sqlopts = sqlopts.join(' AND ')
	sql = "SELECT * FROM housing WHERE #{sqlopts} LIMIT 0, 100"
	puts sql
	listing = db.execute(sql)
	erb :index, :locals => {:listing => listing} 
end