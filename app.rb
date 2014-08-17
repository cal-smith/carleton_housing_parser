require 'sinatra'
require 'sqlite3'

db = SQLite3::Database.new( "housing.db" )

get '/' do
	listing = db.execute("SELECT * FROM housing 
		WHERE zone IN ('ottawa-south', 'old-ottawa-south') AND price <= 700
		ORDER BY PRICE ASC LIMIT 0, 100")
	erb :index, :locals => {:listing => listing}
end

# zone is city zone
# price is upper price limit
# furished is a simple true, false, or undefined option
# type is the type of housing
get '/limit/:zone/?:price?/?:furnished?/?:type?' do
	zone = params[:zone].split('&').collect{|x| "'#{x}'"}.join(', ')
	price = params[:price]
	if params[:price].nil?
		price = 5000
	end
	furnished = params[:furnished]
	puts zone, price, furnished
	sql = "SELECT * FROM housing WHERE zone IN (#{zone}) AND price <= #{price} ORDER BY PRICE ASC LIMIT 0, 100"
	listing = db.execute(sql)
	erb :index, :locals => {:listing => listing} 
end