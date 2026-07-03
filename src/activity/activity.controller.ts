import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/auth-jwt.guard";
import { ActivityService } from "./activity.service";


@Controller("activity")
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get("/me")
  getMyActivity(@Query("limit") limit: number, @Query("offset") offset: number, @Req() req) {
    return this.activityService.getMyActivity(limit, offset, req.user.id);
  }
}