class ApplicationController < ActionController::Base
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to main_app.root_url, notice: exception.message
  end
  rescue_from ActiveRecord::RecordNotFound do |exception|
    redirect_to main_app.root_url, notice: exception.message
  end
  include CanCan::ControllerAdditions
  protect_from_forgery with: :exception

  def index
  end
end
